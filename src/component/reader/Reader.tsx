import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  useLayoutEffect,
} from "react";
import {
  DrawCtrl,
  CtrlMode,
  getDrawCtrl,
  defaultDrawCtrl,
} from "../../lib/draw/drawCtrl";
import { createPage, NoteInfo, NotePage } from "../../lib/note/note";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { AddPageButton, showPageDelMsg } from "./ReaderTools";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { updatePages } from "../../lib/network/http";
import { useBeforeunload } from "react-beforeunload";
import { TeamState } from "../../lib/draw/TeamState";
import { DrawState } from "../../lib/draw/DrawState";
import { Setter, useMounted } from "../../lib/hooks";
import { StateSet } from "../../lib/draw/StateSet";
import { insertAfter } from "../../lib/array";
import SelectTool from "../draw/SelectTool";
import { debounce, last } from "lodash";
import { Map, Set } from "immutable";
import DrawTools from "./DrawTools";
import { TeamCtx } from "./Team";
import Draw from "../draw/Draw";
import { message } from "antd";
import "./reader.sass";

export const ReaderStateCtx = createContext({
  noteID: "",
  noteInfo: undefined as NoteInfo | undefined,
  stateSet: undefined as StateSet | undefined,
  teamState: undefined as TeamState | undefined,
  pageRec: undefined as Record<string, NotePage> | undefined,
  pageOrder: undefined as string[] | undefined,
  saved: true,
  teamOn: false,
  inviewPages: Set<string>(),
  refRec: {} as Record<string, HTMLElement>,
  drawCtrl: defaultDrawCtrl,
  mode: "draw" as CtrlMode,
});

export const ReaderMethodCtx = createContext({
  scrollPage: (pageID: string) => {},
  switchPageMarked: (pageID: string) => {},
  setPageState: (uid: string, ds: DrawState) => {},
  addPage: (prevPageID: string, copy?: boolean) => {},
  addFinalPage: () => {},
  deletePage: (pageID: string) => {},
  saveReorder: async (order: string[], push: boolean) => {},
  setInviewPages: (() => {}) as Setter<Set<string>>,
  setMode: (() => {}) as Setter<CtrlMode>,
  setDrawCtrl: (() => {}) as Setter<DrawCtrl>,
});

export default function Reader({ teamOn }: { teamOn: boolean }) {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Record<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [mode, setMode] = useState<CtrlMode>("draw");
  const [saved, setSaved] = useState(true);
  const [inviewPages, setInviewPages] = useState(Set<string>());
  const [pageOrder, setPageOrder] = useState<string[]>();

  const refRec = useRef<Record<string, HTMLElement>>({});
  const mounted = useMounted();

  const { teamState, teamUpdate, pushOperation, pushNewPage, pushReorder } =
    useContext(TeamCtx);

  const loadNotePages = async () => {
    const storedNote = await loadNote(noteID);
    if (!storedNote) {
      message.error("Note not found");
      return nav("/");
    }
    const { pageRec, pdf, pageOrder, ...noteInfo } = storedNote;
    setPageRec(pageRec);
    setPageOrder(pageOrder);
    setNoteInfo(noteInfo);
    setStateSet(StateSet.createFromPages(pageRec));
    setDrawCtrl(await getDrawCtrl());
    if (teamOn) updatePages(noteID);
  };
  useEffect(() => void loadNotePages(), [noteID, teamOn]);

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      const canvas = document.querySelector("canvas");
      const data = canvas?.toDataURL();
      await editNoteData(noteID, { pageRec: pr, thumbnail: data });
      mounted.current && setSaved(true);
    }, 2000),
    []
  );
  const instantSave = debouncedSave.flush;

  useLayoutEffect(() => () => void instantSave(), []);
  useBeforeunload(instantSave);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  useEffect(() => {
    if (!teamUpdate) return;
    const { type } = teamUpdate;
    if (type === "reorder") {
      const { pageOrder } = teamUpdate;
      saveReorder(pageOrder);

      if (!teamUpdate.deleted) return;
      showPageDelMsg(() => {
        saveReorder(teamUpdate.prevOrder, true);
      });
    } else if (type === "newPage") {
      const { pageOrder } = teamUpdate;
      saveReorder(pageOrder);
      let { pageID, newPage } = teamUpdate;
      savePageRec(pageID, () => newPage);
      setStateSet((prev) => prev?.addState(pageID, newPage));
    } else if (type === "sync") {
      const { pageID, stroke } = teamUpdate;
      setStateSet((prevSS) =>
        prevSS?.updateState(pageID, (prevDS) =>
          DrawState.updateStroke(prevDS, stroke)
        )
      );
    }
  }, [teamUpdate]);

  const savePageRec = (
    pageID: string,
    cb: (prev?: NotePage) => NotePage | undefined
  ) => {
    setPageRec((prevRec) => {
      if (!prevRec) return;
      const prevPage = prevRec[pageID];
      const newPage = cb(prevPage);
      if (!newPage) return;
      const newRec = { ...prevRec, [pageID]: newPage };
      debouncedSave(newRec);
      return newRec;
    });
    setSaved(false);
  };

  const updatePageRec = (pageID: string, ds: DrawState) => {
    const state = DrawState.flaten(ds);
    savePageRec(pageID, (prev) => prev && { ...prev, state });
  };

  const setPageState = useCallback((pageID: string, ds: DrawState) => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.setState(pageID, ds);
      newSS.lastOp && pushOperation(newSS.lastOp);
      return newSS;
    });
    updatePageRec(pageID, ds);
  }, []);

  const switchPageMarked = (pageID: string) => {
    savePageRec(pageID, (prev) => prev && { ...prev, marked: !prev.marked });
  };

  const handleUndo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.undo();
      const lastDS = newSS.getLastDS();
      lastDS && updatePageRec(...lastDS);
      newSS.lastOp && pushOperation(newSS.lastOp);
      return newSS;
    });
  };

  const handleRedo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.redo();
      const lastDS = newSS.getLastDS();
      lastDS && updatePageRec(...lastDS);
      newSS.lastOp && pushOperation(newSS.lastOp);
      return newSS;
    });
  };

  const scrollPage = (pageID: string) => {
    refRec.current[pageID]?.scrollIntoView();
  };

  const saveReorder = async (newOrder: string[], push = false) => {
    setPageOrder(newOrder);
    await editNoteData(noteID, { pageOrder: newOrder });
    await instantSave();
    push && pushReorder(newOrder);
  };

  const addPage = (prevPageID: string, copy = false) => {
    if (!pageOrder) return;
    const prevPage = copy ? pageRec && pageRec[prevPageID] : undefined;
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
      <DrawTools
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        instantSave={instantSave}
      />
      <main>
        {pageOrder?.map((uid) => (
          <PageContainer uid={uid} key={uid} />
        ))}
        <AddPageButton />
      </main>
    </div>
  );

  return (
    <ReaderStateCtx.Provider
      value={{
        noteID,
        noteInfo,
        stateSet,
        teamState,
        saved,
        teamOn,
        pageRec,
        pageOrder,
        inviewPages,
        refRec: refRec.current,
        mode,
        drawCtrl,
      }}
    >
      <ReaderMethodCtx.Provider
        value={{
          scrollPage,
          setInviewPages,
          switchPageMarked,
          setPageState,
          addPage,
          addFinalPage,
          deletePage,
          setMode,
          setDrawCtrl,
          saveReorder,
        }}
      >
        {renderResult}
      </ReaderMethodCtx.Provider>
    </ReaderStateCtx.Provider>
  );
}

const PageContainer: FC<{ uid: string }> = ({ uid }) => {
  const { pageRec, stateSet, teamState } = useContext(ReaderStateCtx);
  const { setPageState } = useContext(ReaderMethodCtx);

  const page = pageRec && pageRec[uid];
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageState(uid);
  const updateState = useCallback(
    (ds: DrawState) => setPageState(uid, ds),
    [uid, setPageState]
  );
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
  const { refRec, noteID } = useContext(ReaderStateCtx);
  const [fullImg, setFullImg] = useState<string>();
  const [visibleRef, visible] = useInView({ delay: 100 });

  const { height, width } = drawState;
  const ratio = height / width;

  const handleRef = useCallback(
    (e: HTMLDivElement | null) => {
      if (!e) return;
      visibleRef(e);
      if (!preview && refRec) refRec[uid] = e;
    },
    [refRec]
  );

  const loadImage = useCallback(
    (() => {
      let called = false;
      return async () => {
        if (preview || !pdfIndex || called) return;
        called = true;
        const { getOnePageImage } = await import("../../lib/note/pdfImage");
        setFullImg(await getOnePageImage(noteID, pdfIndex));
      };
    })(),
    [preview, pdfIndex]
  );

  useEffect(() => {
    if (preview) return;
    if (visible) {
      loadImage();
      setInviewPages((prev) => prev.add(uid));
    } else {
      setInviewPages((prev) => prev.delete(uid));
    }
  }, [visible, loadImage, preview]);

  const { ignores } = useContext(TeamCtx);
  const otherStates = useMemo(
    () => teamStateMap && Array.from(teamStateMap.deleteAll(ignores).values()),
    [teamStateMap, ignores]
  );

  const imageLoaded = fullImg || !pdfIndex;
  const drawShow = visible && imageLoaded;
  const maskShow = Boolean(preview || !imageLoaded);

  return (
    <section
      ref={handleRef}
      className="note-page"
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
    </section>
  );
};
PageWrapper.displayName = "PageWrapper";

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
  const { mode, drawCtrl } = useContext(ReaderStateCtx);

  const handleChange = useCallback(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      let ds = arg instanceof DrawState ? arg : arg(drawState);
      updateState(ds);
    },
    [updateState, drawState]
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
    <Draw
      drawState={drawState}
      otherStates={otherStates}
      onChange={handleChange}
      imgSrc={imgSrc}
      drawCtrl={drawCtrl}
      mode={mode}
      SelectTool={SelectTool}
    />
  );
};
DrawWrapper.displayName = "DrawWrapper";
