import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { NoteInfo, NotePage, createPage, defaultNotePage } from "lib/note/note";
import { DrawCtrlProvider } from "lib/draw/DrawCtrl";
import { NewPageInfo, ReorderInfo, SyncInfo } from "lib/network/io";
import { DarkModeProvider } from "lib/Dark";
import { useMemoizedFn as useEvent, useSafeState } from "ahooks";
import { SetOperation, StateSet } from "lib/draw/StateSet";
import { loadNote, editNoteData } from "lib/note/archive";
import { AddPageButton, showPageDelMsg } from "./ReaderUtils";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "component/PageWrapper";
import { DrawState } from "lib/draw/DrawState";
import { useScrollPage } from "./lib/scroll";
import { debounce, last } from "lodash-es";
import { insertAfter } from "./lib/array";
import { PageNav } from "./PageNav";
import { AsideOpenProvider, Setter } from "lib/hooks";
import { Header } from "./header";
import { TeamCtx } from "./Team";
import { Map } from "immutable";
import { message } from "antd";
import "./reader.sass";

export const ReaderStateCtx = React.createContext<{
  noteID: string;
  currPageID: string;
  noteInfo?: NoteInfo;
  stateSet?: StateSet;
  pageRec?: Map<string, NotePage>;
  pageOrder?: string[];
}>({ noteID: "", currPageID: "" });

export const ReaderMethodCtx = React.createContext({
  scrollPage: (pageID: string) => {},
  switchPageMarked: (pageID: string) => {},
  addPage: (prevPageID: string, copy?: boolean) => {},
  addFinalPage: () => {},
  deletePage: (pageID: string) => {},
  saveReorder: async (order: string[], push: boolean) => {},
});

export default function Reader() {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Map<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [saved, setSaved] = useSafeState(true);

  const { io, teamOn, addTeamStatePage } = useContext(TeamCtx);
  const { setInviewRatios, scrollPage, sectionRef, currPageID } = useScrollPage(
    noteID,
    pageOrder
  );

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
  }, [nav, noteID, teamOn]);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  const saver = useEvent(async () => {
    const pr = pageRec?.toObject();
    await editNoteData(noteID, { pageRec: pr });
    setSaved(true);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce(saver, 2000), [saver]);
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
    const handleSync = ({ pageID, stroke }: SyncInfo) =>
      setStateSet((prev) => prev?.syncStrokeTime(pageID, stroke));

    io?.emit("push", { operation }, handleSync);
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

  const updatePageRec = (pageID: string, ds: DrawState) => {
    const state = DrawState.flaten(ds);
    savePageRec(pageID, (prev) => ({ ...prev, state }));
  };

  const updateStateSet = (cb: (prevSS: StateSet) => StateSet) => {
    if (!stateSet) return;
    const newSS = cb(stateSet);
    if (newSS === stateSet) return;
    setStateSet(newSS);
    const lastDS = newSS.getLastDS();
    const lastOp = newSS.lastOp;
    if (!lastDS || !lastOp) return;
    updatePageRec(...lastDS);
    pushOperation(lastOp);
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

  const renderResult = (
    <div className="reader container">
      <Header
        saved={saved}
        instantSave={instantSave}
        handleUndo={() => updateStateSet((prev) => prev.undo())}
        handleRedo={() => updateStateSet((prev) => prev.redo())}
      />
      <main>
        {pageOrder?.map((uid) => (
          <section key={uid} className="note-page" ref={sectionRef(uid)}>
            <PageContainer
              uid={uid}
              updateStateSet={updateStateSet}
              setInviewRatios={setInviewRatios}
            />
          </section>
        ))}
        <AddPageButton />
      </main>
      <PageNav />
    </div>
  );

  return (
    <DarkModeProvider>
      <ReaderStateCtx.Provider
        value={{
          noteID,
          pageRec,
          noteInfo,
          stateSet,
          pageOrder,
          currPageID,
        }}
      >
        <ReaderMethodCtx.Provider
          value={{
            addPage,
            scrollPage,
            deletePage,
            saveReorder,
            addFinalPage,
            switchPageMarked,
          }}
        >
          <DrawCtrlProvider>
            <AsideOpenProvider>{renderResult}</AsideOpenProvider>
          </DrawCtrlProvider>
        </ReaderMethodCtx.Provider>
      </ReaderStateCtx.Provider>
    </DarkModeProvider>
  );
}

const PageContainer: FC<{
  uid: string;
  updateStateSet: (cb: (prevSS: StateSet) => StateSet) => void;
  setInviewRatios: Setter<Map<string, number>>;
}> = ({ uid, updateStateSet, setInviewRatios }) => {
  const { pageRec, stateSet, currPageID, pageOrder, noteID } =
    useContext(ReaderStateCtx);
  const { teamState, ignores } = useContext(TeamCtx);

  const page = pageRec?.get(uid);
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);
  const updateState = (ds: DrawState) => {
    updateStateSet((prev) => prev.setState(uid, ds));
  };

  const onViewChange = (visible: boolean, ratio: number) => {
    if (!visible) return setInviewRatios((prev) => prev.delete(uid));
    setInviewRatios((prev) => prev.set(uid, ratio));
  };

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
    />
  );
};
