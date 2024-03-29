import {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { NoteInfo, NotePage, createPage, defaultNotePage } from "lib/note/note";
import { DrawCtrlProvider, useDrawCtrl } from "lib/draw/DrawCtrl";
import { NewPageInfo, pushAck, ReorderInfo } from "lib/network/io";
import { DarkModeProvider } from "lib/Dark";
import { SetOperation, StateSet } from "lib/draw/StateSet";
import { loadNote, editNoteData } from "lib/note/archive";
import { showPageDelMsg, showReopenMsg } from "./tools/Messages";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "component/PageWrapper";
import { DrawState } from "draft-pad/dist/lib";
import { useScrollPage } from "./lib/scroll";
import { debounce, last } from "lodash";
import { insertAfter } from "./lib/array";
import { PageNav } from "./PageNav";
import { AsideOpenProvider, Setter, useEvent } from "lib/hooks";
import { AddPageButton } from "./tools/AddButton";
import { Header } from "./Header";
import { TeamCtx } from "./Team";
import { Map } from "immutable";
import { message } from "antd";
import { InfoNav } from "./Info";
import { useRedoUndo } from "lib/keyboard";
import "./reader.sass";

export interface ReaderStates {
  noteID: string;
  currPageID: string;
  stateSet: StateSet;
  pageRec: Map<string, NotePage>;
  pageOrder: string[];
  size: number;
}

export interface ReaderMethods {
  scrollPage: (pageID: string) => void;
  switchPageMarked: (pageID: string) => void;
  addPage: (prevPageID: string, copy?: boolean) => void;
  addFinalPage: () => void;
  deletePage: (pageID: string) => void;
  saveReorder: (order: string[], push: boolean) => Promise<void>;
  setSize: Setter<number>;
}

export default function Reader() {
  return (
    <AsideOpenProvider>
      <DarkModeProvider>
        <DrawCtrlProvider>
          <ReaderContent />
        </DrawCtrlProvider>
      </DarkModeProvider>
    </AsideOpenProvider>
  );
}

const ReaderContent: FC = () => {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Map<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [saved, setSaved] = useState(true);

  const { io, addTeamStatePage, checkOpID } = useContext(TeamCtx);

  useEffect(() => {
    (async () => {
      const storedNote = await loadNote(noteID);
      if (!storedNote) {
        message.error("Note not found");
        return nav("/");
      }
      const { pageRec, pdf, pageOrder, ...noteInfo } = storedNote;
      setPageRec(Map(pageRec));
      setPageOrder(pageOrder);
      setNoteInfo(noteInfo);
      setStateSet(StateSet.createFromPages(pageRec));
    })();
  }, [nav, noteID]);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  useEffect(() => {
    document.body.classList.add("reader");
    return () => document.body.classList.remove("reader");
  }, []);

  const saver = useEvent(async (withState = false) => {
    let currPageRec = pageRec;
    if (withState) {
      stateSet?.getStates().forEach((ds, pageID) => {
        currPageRec = currPageRec?.update(pageID, defaultNotePage, (page) => ({
          ...page,
          state: DrawState.flaten(ds),
        }));
      });
      setPageRec(currPageRec);
    }
    const pr = currPageRec?.toObject();
    await editNoteData(noteID, { pageRec: pr });
    setSaved(true);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce(saver, 5000), [saver]);
  const instantSave = debouncedSave.flush;

  const savePageRec = (pageID: string, cb: (prev: NotePage) => NotePage) => {
    setPageRec((prev) => prev?.update(pageID, defaultNotePage, cb));
    setSaved(false);
    debouncedSave();
  };

  const saveReorder = async (pageOrder: string[], push = false) => {
    setPageOrder(pageOrder);
    await editNoteData(noteID, { pageOrder });
    await instantSave();
    push && pushReorder(pageOrder);
  };

  const pushReorder = (pageOrder: string[]) =>
    io?.emit("reorder", { pageOrder });

  const handleReorder = useEvent(
    ({ deleted, pageOrder, prevOrder }: ReorderInfo) => {
      saveReorder(pageOrder);
      if (!deleted) return;
      showPageDelMsg(() => saveReorder(prevOrder, true));
    }
  );

  const handleNewPage = useEvent(
    ({ pageOrder, pageID, newPage }: NewPageInfo) => {
      saveReorder(pageOrder);
      savePageRec(pageID, () => newPage);
      setStateSet((prev) => prev?.addState(pageID, newPage));
    }
  );

  useEffect(() => {
    io?.on("reorder", handleReorder);
    io?.on("newPage", handleNewPage);
    return () => void io?.removeAllListeners();
  }, [io, handleReorder, handleNewPage]);

  const pushOperation = (operation: SetOperation) => {
    const handleSync = (t: number) => {
      if (operation.type !== "add") return;
      const { pageID, stroke } = operation;
      const { uid } = stroke;
      setStateSet((prev) => prev?.syncStrokeTime(pageID, uid, t));
    };

    io?.emit(
      "push",
      { operation },
      ({ timestamp, prevID, currID }: pushAck) => {
        handleSync(timestamp);
        checkOpID(prevID, currID);
      }
    );
  };

  const pushNewPage = (
    pageOrder: string[],
    pageID: string,
    newPage: NotePage
  ) => {
    const { image, marked, ...newTeamPage } = newPage;
    io?.emit("newPage", { pageOrder, pageID, newPage: newTeamPage });
    addTeamStatePage(pageID, newPage);
  };

  const updateStateSet = (cb: (prevSS: StateSet) => StateSet) => {
    if (!stateSet) return;
    const newSS = cb(stateSet);
    if (newSS === stateSet) return;
    setStateSet(newSS);
    setSaved(false);
    debouncedSave(true);
    const lastOp = newSS.lastOp;
    lastOp && pushOperation(lastOp);
  };

  const switchPageMarked = (pageID: string) =>
    savePageRec(pageID, (prev) => ({ ...prev, marked: !prev.marked }));

  const addPage = (prevPageID: string, copy = false) => {
    if (!pageOrder) return;
    const prevPage = copy ? pageRec?.get(prevPageID) : undefined;
    const [pageID, newPage] = createPage(prevPage);
    const newOrder = insertAfter(pageOrder, prevPageID, pageID);
    pushNewPage(newOrder, pageID, newPage);
    saveReorder(newOrder);
    savePageRec(pageID, () => newPage);
    setStateSet((prev) => prev?.addState(pageID, newPage));
  };

  const addFinalPage = () => {
    const lastPageID = last(pageOrder);
    lastPageID && addPage(lastPageID);
  };

  const deletePage = (pageID: string) => {
    const newOrder = pageOrder?.filter((id) => id !== pageID);
    newOrder?.length && saveReorder(newOrder, true);
  };

  const [size, setSize] = useState(100);
  const isFull = size === 100;
  const pd = (100 - size) / 2 + "%";
  const mainStyle = { paddingLeft: pd, paddingRight: pd };

  const { setInviewRatios, scrollPage, sectionRef, currPageID, scrolling } =
    useScrollPage(noteID, pageOrder, [size]);

  const { finger } = useDrawCtrl();

  useEffect(() => {
    if (!window.BroadcastChannel) return;
    const bc = new BroadcastChannel("open note");
    bc.postMessage(noteID);
    bc.onmessage = (e) => {
      if (e.data !== noteID) return;
      debouncedSave.cancel();
      showReopenMsg(() => nav("/"));
    };
    return () => bc.close();
  }, [nav, noteID, debouncedSave]);

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      if (saved) return;
      e.preventDefault();
      return (e.returnValue = "");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [saved]);

  const renameNote = async (name: string) => {
    if (name === noteInfo?.name) return;
    await editNoteData(noteID, { name });
    const storedNote = await loadNote(noteID);
    if (!storedNote) return;
    const { pageRec, pdf, pageOrder, ...info } = storedNote;
    setNoteInfo(info);
  };

  const handleUndo = () => updateStateSet((prev) => prev.undo());
  const handleRedo = () => updateStateSet((prev) => prev.redo());
  useRedoUndo(handleUndo, handleRedo);

  if (!stateSet || !pageOrder || !pageRec || !noteInfo) return null;
  const readerStates: ReaderStates = {
    noteID,
    pageRec,
    pageOrder,
    stateSet,
    currPageID,
    size,
  };
  const readerMethods: ReaderMethods = {
    scrollPage,
    switchPageMarked,
    addFinalPage,
    addPage,
    deletePage,
    saveReorder,
    setSize,
  };

  return (
    <div className="reader container">
      <Header
        saved={saved}
        instantSave={instantSave}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        undoable={stateSet.isUndoable()}
        redoable={stateSet.isRedoable()}
      />
      <InfoNav noteInfo={noteInfo} renameNote={renameNote} />
      <main data-finger={finger} data-full={isFull} style={mainStyle}>
        {pageOrder.map((uid) => (
          <section key={uid} className="note-page" ref={sectionRef(uid)}>
            <PageContainer
              uid={uid}
              updateStateSet={updateStateSet}
              setInviewRatios={setInviewRatios}
              scrolling={scrolling}
              {...readerStates}
            />
          </section>
        ))}
        <footer>
          <AddPageButton addFinalPage={addFinalPage} />
        </footer>
      </main>
      <PageNav {...readerStates} {...readerMethods} />
    </div>
  );
};

const PageContainer: FC<
  {
    uid: string;
    updateStateSet: (cb: (prevSS: StateSet) => StateSet) => void;
    setInviewRatios: Setter<Map<string, number>>;
    scrolling: boolean;
  } & ReaderStates
> = ({
  uid,
  updateStateSet,
  setInviewRatios,
  scrolling,
  pageRec,
  stateSet,
  currPageID,
  pageOrder,
  noteID,
}) => {
  const { teamState, ignores } = useContext(TeamCtx);

  const page = pageRec.get(uid);
  const drawState = stateSet.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);
  const updateState = useEvent((ds: DrawState) => {
    updateStateSet((prev) => prev.setState(uid, ds));
  });

  const onViewChange = useEvent((ratio: number) => {
    if (!ratio) return setInviewRatios((prev) => prev.delete(uid));
    setInviewRatios((prev) => prev.set(uid, ratio));
  });

  const preload = useMemo(() => {
    if (!pageOrder) return false;
    const currIndex = pageOrder.indexOf(currPageID);
    const selfIndex = pageOrder.indexOf(uid);
    return Math.abs(selfIndex - currIndex) <= 1;
  }, [currPageID, uid, pageOrder]);

  if (!page || !drawState) return null;
  return (
    <PageWrapper
      drawState={drawState}
      teamStateMap={teamStateMap}
      updateState={updateState}
      pdfIndex={page.pdfIndex}
      noteID={noteID}
      ignores={ignores}
      onViewChange={onViewChange}
      preload={preload}
      skipInView={scrolling}
    />
  );
};
