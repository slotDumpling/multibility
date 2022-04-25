import React, {
  FC,
  useRef,
  useMemo,
  useState,
  Dispatch,
  useEffect,
  useContext,
  useCallback,
  createContext,
  SetStateAction,
  useLayoutEffect,
} from "react";
import {
  DrawCtrl,
  CtrlMode,
  getDrawCtrl,
  saveDrawCtrl,
  defaultDrawCtrl,
} from "../../lib/draw/drawCtrl";
import { createPage, NoteInfo, NotePage } from "../../lib/note/note";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { putNote, updatePages } from "../../lib/network/http";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useBeforeunload } from "react-beforeunload";
import { TeamState } from "../../lib/draw/TeamState";
import { DrawState } from "../../lib/draw/DrawState";
import { StateSet } from "../../lib/draw/StateSet";
import { debounce, last, omit } from "lodash";
import { insertAfter } from "../../lib/array";
import { AddPageButton } from "./ReaderTools";
import { useMounted } from "../../lib/hooks";
import { Map, Set } from "immutable";
import DrawTools from "./DrawTools";
import { TeamCtx } from "./Team";
import Draw from "../draw/Draw";
import { message } from "antd";
import "./reader.sass";

export const WIDTH = 2000;

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
  createRoom: () => {},
  scrollPage: (() => {}) as (pageID: string) => void,
  setInviewPages: (() => {}) as Dispatch<SetStateAction<Set<string>>>,
  switchPageMarked: (() => {}) as (pageID: string) => void,
  setPageOrder: (() => {}) as Dispatch<SetStateAction<string[] | undefined>>,
  setPageState: (() => {}) as (uid: string, ds: DrawState) => void,
  addPage: (() => {}) as (prevpageID: string, copy?: boolean) => void,
  addFinalPage: () => {},
  deletePage: (() => {}) as (pageID: string) => void,
  setMode: (() => {}) as Dispatch<SetStateAction<CtrlMode>>,
  setDrawCtrl: (() => {}) as Dispatch<SetStateAction<DrawCtrl>>,
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
  const [loaded, setLoaded] = useState(false);
  const refRec = useRef<Record<string, HTMLElement>>({});
  const mounted = useMounted();

  const { teamState, pushOperation, teamUpdate, updateNewPage } =
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
    setStateSet(StateSet.createFromPages(pageRec, WIDTH));
    setDrawCtrl(await getDrawCtrl());
    setLoaded(true);
    if (teamOn) updatePages(noteID);
  };

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      await editNoteData(noteID, { pageRec: pr });
      const canvas = document.querySelector("canvas");
      const data = canvas?.toDataURL();
      data && editNoteData(noteID, { thumbnail: data });
      mounted.current && setSaved(true);
    }, 5000),
    []
  );
  const instantSave = debouncedSave.flush;

  const createRoom = async () => {
    await instantSave();
    const resCode = await putNote(noteID);
    if (!resCode) {
      message.error("Can't create room.");
      return;
    }
    await editNoteData(noteID, { team: true });
    nav("/team/" + noteID);
  };

  const noteInit = () => {
    loadNotePages();
  };

  const noteDestroy = () => {
    instantSave();
  };

  useLayoutEffect(() => {
    noteInit();
    return noteDestroy;
  }, [noteID, teamOn]);

  useBeforeunload(noteDestroy);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  useEffect(() => {
    loaded && saveDrawCtrl(drawCtrl);
  }, [drawCtrl]);

  useEffect(() => {
    if (!stateSet?.lastOp || !pushOperation) return;
    pushOperation(stateSet.lastOp);
  }, [stateSet]);

  useEffect(() => {
    if (!pageRec || !loaded) return;
    debouncedSave(pageRec);
    setSaved(false);
  }, [pageRec]);

  useEffect(() => {
    const handleReorder = async () => {
      if (!pageOrder || !loaded) return;
      await editNoteData(noteID, { pageOrder });
      await instantSave();
      const teamOrder = teamUpdate?.pageOrder;
      if (teamOn && JSON.stringify(pageOrder) !== JSON.stringify(teamOrder)) {
        updatePages(noteID);
      }
    };
    handleReorder();
  }, [pageOrder]);

  useEffect(() => {
    if (!teamUpdate) return;
    const { type, pageOrder } = teamUpdate;
    if (type === "reorder") {
      setPageOrder(pageOrder);
    } else if (type === "newPage") {
      setPageOrder(pageOrder);
      let { pageID, newPage } = teamUpdate;
      setPageRec((prev) => prev && { ...prev, [pageID]: newPage });
      setStateSet((prev) => prev?.addState(pageID, newPage, WIDTH));
    }
  }, [teamUpdate]);

  const updatePageRec = (pageID: string, ds: DrawState) => {
    const state = DrawState.flaten(ds);
    setPageRec(
      (prev) => prev && { ...prev, [pageID]: { ...prev[pageID], state } }
    );
  };

  const setPageState = useCallback((uid: string, ds: DrawState) => {
    setStateSet((prev) => prev?.setState(uid, ds));
    updatePageRec(uid, ds);
  }, []);

  const switchPageMarked = (pageID: string) => {
    const page = pageRec && pageRec[pageID];
    if (!page) return;
    const marked = !Boolean(page.marked);
    setPageRec(
      (prev) => prev && { ...prev, [pageID]: { ...prev[pageID], marked } }
    );
  };

  const handleUndo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.undo();
      const lastDS = newSS.getLastDS();
      lastDS && updatePageRec(...lastDS);
      return newSS;
    });
  };

  const handleRedo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.redo();
      const lastDS = newSS.getLastDS();
      lastDS && updatePageRec(...lastDS);
      return newSS;
    });
  };

  const scrollPage = (pageID: string) => {
    refRec.current[pageID]?.scrollIntoView();
  };

  const addPage = (prevpageID: string, copy = false) => {
    const prevPage = copy ? pageRec && pageRec[prevpageID] : undefined;
    const [pageID, newPage] = createPage(prevPage);
    setPageOrder((prev) => {
      if (!prev) return;
      const newOrder = insertAfter(prev, prevpageID, pageID);
      updateNewPage && updateNewPage(newOrder, pageID, newPage);
      return newOrder;
    });
    setPageRec((prev) => prev && { ...prev, [pageID]: newPage });
    setStateSet((prev) => prev?.addState(pageID, newPage, WIDTH));
  };

  const addFinalPage = () => {
    const lastpageID = last(pageOrder);
    lastpageID && addPage(lastpageID);
  };

  const deletePage = (pageID: string) => {
    if (teamOn) {
      message.error("You can't delete pages from a team note.");
      return;
    }
    setPageOrder((prev) => prev?.filter((id) => id !== pageID));
    setPageRec((prev) => prev && omit(prev, pageID));
    setStateSet((prev) => prev?.deleteState(pageID));
  };

  const renderResult = (
    <div className="reader container">
      <DrawTools
        instantSave={instantSave}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
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
          createRoom,
          scrollPage,
          setInviewPages,
          switchPageMarked,
          setPageOrder,
          setPageState,
          addPage,
          addFinalPage,
          deletePage,
          setMode,
          setDrawCtrl,
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
          imgSrc={fullImg || thumbnail || undefined}
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
  const { setMode } = useContext(ReaderMethodCtx);

  const handleChange = useCallback(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      let ds = arg instanceof DrawState ? arg : arg(drawState);
      updateState(ds);
    },
    [updateState, drawState]
  );

  return (
    <div className="page-draw">
      {preview ? (
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
          setMode={setMode}
        />
      )}
    </div>
  );
};
DrawWrapper.displayName = "DrawWrapper";
