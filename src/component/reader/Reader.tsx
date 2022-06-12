import {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import {
  DrawCtrl,
  getDrawCtrl,
  defaultDrawCtrl,
} from "../../lib/draw/drawCtrl";
import {
  NoteInfo,
  NotePage,
  createPage,
  defaultNotePage,
} from "../../lib/note/note";
import { useInViewport, useMemoizedFn as useEvent, useSafeState } from "ahooks";
import { NewPageInfo, ReorderInfo, SyncInfo } from "../../lib/network/io";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { AddPageButton, showPageDelMsg } from "./ReaderUtils";
import { useParams, useNavigate } from "react-router-dom";
import { DrawState } from "../../lib/draw/DrawState";
import { updatePages } from "../../lib/network/http";
import { TeamState } from "../../lib/draw/TeamState";
import { SelectTool, TextTool } from "./DrawTools";
import { insertAfter } from "../../lib/array";
import { Setter } from "../../lib/hooks";
import { debounce, once } from "lodash-es";
import { Map, Set } from "immutable";
import ReaderHeader from "./header/ReaderHeader";
import { TeamCtx } from "./Team";
import Draw, { ActiveToolKey, DrawRefType } from "../draw/Draw";
import { message } from "antd";
import "./reader.sass";

export const ReaderStateCtx = createContext({
  noteID: "",
  noteInfo: undefined as NoteInfo | undefined,
  stateSet: undefined as StateSet | undefined,
  teamState: undefined as TeamState | undefined,
  pageRec: undefined as Map<string, NotePage> | undefined,
  pageOrder: undefined as string[] | undefined,
  saved: true,
  inviewPages: Set<string>(),
  drawCtrl: defaultDrawCtrl,
});

export const ReaderMethodCtx = createContext({
  scrollPage: (pageID: string) => {},
  switchPageMarked: (pageID: string) => {},
  updateStateSet: (cb: (prevSS: StateSet) => StateSet) => {},
  addPage: (prevPageID: string, copy?: boolean) => {},
  addFinalPage: () => {},
  deletePage: (pageID: string) => {},
  saveReorder: async (order: string[], push: boolean) => {},
  setInviewPages: (() => {}) as Setter<Set<string>>,
  setDrawCtrl: (() => {}) as Setter<DrawCtrl>,
  instantSave: (() => {}) as () => Promise<void> | undefined,
  handleUndo: () => {},
  handleRedo: () => {},
});

export default function Reader() {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Map<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [inviewPages, setInviewPages] = useState(Set<string>());
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [saved, setSaved] = useSafeState(true);

  const refRec = useRef<Record<string, HTMLElement>>({});

  const { io, teamOn, teamState, addTeamStatePage } = useContext(TeamCtx);

  useEffect(() => {
    const loadNotePages = async () => {
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
      setDrawCtrl(await getDrawCtrl());
      if (teamOn) updatePages(noteID);
    };
    loadNotePages();
  }, [nav, noteID, teamOn]);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  const saver = useEvent(async () => {
    const pr = pageRec?.toObject();
    const canvas = document.querySelector("canvas");
    const thumbnail = canvas?.toDataURL();
    await editNoteData(noteID, { pageRec: pr, thumbnail });
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

  const pushReorder = (pageOrder: string[]) => {
    io?.emit("reorder", { pageOrder });
  };

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
    setStateSet(newSS);
    const lastDS = newSS.getLastDS();
    const lastOp = newSS.lastOp;
    if (!lastDS || !lastOp) return;
    updatePageRec(...lastDS);
    pushOperation(lastOp);
  };

  const switchPageMarked = (pageID: string) => {
    savePageRec(pageID, (prev) => ({ ...prev, marked: !prev.marked }));
  };

  const scrollPage = (pageID: string) => {
    refRec.current[pageID]?.scrollIntoView();
  };

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
    const lastPageID = pageOrder?.at(-1);
    lastPageID && addPage(lastPageID);
  };

  const deletePage = (pageID: string) => {
    const newOrder = pageOrder?.filter((id) => id !== pageID);
    newOrder?.length && saveReorder(newOrder, true);
  };

  const handleUndo = () => updateStateSet((prev) => prev.undo());
  const handleRedo = () => updateStateSet((prev) => prev.redo());
  const renderResult = (
    <div className="reader container">
      <ReaderHeader />
      <main>
        {pageOrder?.map((uid) => (
          <section
            key={uid}
            className="note-page"
            ref={(e) => e && (refRec.current[uid] = e)}
          >
            <PageContainer uid={uid} />
          </section>
        ))}
        <AddPageButton />
      </main>
    </div>
  );

  return (
    <ReaderStateCtx.Provider
      value={{
        saved,
        noteID,
        pageRec,
        drawCtrl,
        noteInfo,
        stateSet,
        teamState,
        pageOrder,
        inviewPages,
      }}
    >
      <ReaderMethodCtx.Provider
        value={{
          addPage,
          scrollPage,
          deletePage,
          setDrawCtrl,
          saveReorder,
          instantSave,
          addFinalPage,
          handleRedo,
          handleUndo,
          updateStateSet,
          setInviewPages,
          switchPageMarked,
        }}
      >
        {renderResult}
      </ReaderMethodCtx.Provider>
    </ReaderStateCtx.Provider>
  );
}

const PageContainer: FC<{ uid: string }> = ({ uid }) => {
  const { pageRec, stateSet, teamState } = useContext(ReaderStateCtx);
  const { updateStateSet } = useContext(ReaderMethodCtx);

  const page = pageRec?.get(uid);
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);
  const updateState = (ds: DrawState) => {
    updateStateSet((prev) => prev.setState(uid, ds));
  };

  if (!page || !drawState) return null;
  return (
    <PageWrapper
      drawState={drawState}
      teamStateMap={teamStateMap}
      updateState={updateState}
      pdfIndex={page.pdfIndex}
      uid={uid}
    />
  );
};

export const PageWrapper = ({
  thumbnail,
  drawState,
  teamStateMap,
  updateState,
  pdfIndex,
  preview = false,
  uid,
}: {
  uid: string;
  drawState: DrawState;
  teamStateMap?: Map<string, DrawState>;
  thumbnail?: string;
  pdfIndex?: number;
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
}) => {
  const { setInviewPages } = useContext(ReaderMethodCtx);
  const { noteID } = useContext(ReaderStateCtx);
  const [fullImg, setFullImg] = useState<string>();
  const wrapperEl = useRef<HTMLDivElement>(null);
  const [visible] = useInViewport(wrapperEl);

  const { height, width } = drawState;
  const ratio = height / width;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadImage = useCallback(
    once(async () => {
      if (!pdfIndex) return;
      const { getOnePageImage } = await import("../../lib/note/pdfImage");
      setFullImg(await getOnePageImage(noteID, pdfIndex));
    }),
    [pdfIndex, noteID]
  );

  useEffect(() => {
    if (preview) return;
    if (visible) {
      loadImage();
      setInviewPages((prev) => prev.add(uid));
    } else {
      setInviewPages((prev) => prev.delete(uid));
    }
  }, [visible, preview, uid, loadImage, setInviewPages]);

  const { ignores } = useContext(TeamCtx);
  const otherStates = useMemo(
    () => teamStateMap?.deleteAll(ignores).toList().toArray(),
    [teamStateMap, ignores]
  );

  const imageLoaded = fullImg || !pdfIndex;
  const drawShow = visible && imageLoaded;
  const maskShow = Boolean(preview || !drawShow);

  return (
    <div
      ref={wrapperEl}
      className="page-wrapper"
      style={{ paddingTop: `${ratio * 100}%` }}
    >
      {drawShow && (
        <DrawWrapper
          drawState={drawState}
          otherStates={otherStates}
          updateState={updateState}
          imgSrc={fullImg || thumbnail}
          preview={preview}
        />
      )}
      {maskShow && <div className="mask" />}
    </div>
  );
};

const DrawWrapper = ({
  drawState,
  updateState,
  otherStates,
  preview = false,
  imgSrc,
}: {
  drawState: DrawState;
  otherStates?: DrawState[];
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
  imgSrc?: string;
}) => {
  const { drawCtrl } = useContext(ReaderStateCtx);
  const [activeTool, setActiveTool] = useState<ActiveToolKey>("");
  const drawRef = useRef<DrawRefType>(null);

  const handleChange = useEvent(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      const newDS = arg instanceof DrawState ? arg : arg(drawState);
      updateState(newDS);
    }
  );

  return preview ? (
    <Draw
      drawState={drawState}
      otherStates={otherStates}
      imgSrc={imgSrc}
      readonly
      preview
    />
  ) : (
    <>
      <Draw
        drawState={drawState}
        otherStates={otherStates}
        onChange={handleChange}
        imgSrc={imgSrc}
        drawCtrl={drawCtrl}
        ref={drawRef}
        setActiveTool={setActiveTool}
      />
      <SelectTool drawRef={drawRef} visible={activeTool === "select"} />
      <TextTool drawRef={drawRef} visible={activeTool === "text"} />
    </>
  );
};
DrawWrapper.displayName = "DrawWrapper";
