import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Draw from "../draw/Draw";
import {
  CtrlMode,
  defaultDrawCtrl,
  DrawCtrl,
  getDrawCtrl,
  saveDrawCtrl,
} from "../../lib/draw/drawCtrl";
import { DrawState } from "../../lib/draw/DrawState";
import { createPage, NoteInfo, NotePage } from "../../lib/note/note";
import { StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { debounce, last, omit } from "lodash";
import { putNote, updatePages } from "../../lib/network/http";
import { useBeforeunload } from "react-beforeunload";
import DrawTools from "./DrawTools";
import { getOneImage } from "../../lib/note/pdfImage";
import { useInView } from "react-intersection-observer";
import { Set } from "immutable";
import { insertAfter } from "../../lib/array";
import { AddPageButton } from "./ReaderTools";
import { useMounted } from "../../lib/hooks";
import { TeamCtx } from "./Team";
import "./reader.sass";

export const WIDTH = 2000;

export const ReaderStateCtx = createContext({
  noteId: "",
  noteInfo: undefined as NoteInfo | undefined,
  stateSet: undefined as StateSet | undefined,
  teamStateSet: undefined as StateSet | undefined,
  pdfFile: undefined as Blob | undefined,
  pageRec: undefined as Record<string, NotePage> | undefined,
  pageOrder: undefined as string[] | undefined,
  saved: true,
  teamOn: false,
  inviewPages: Set<string>(),
  refRec: {} as Record<string, HTMLDivElement>,
  drawCtrl: defaultDrawCtrl,
  mode: "draw" as CtrlMode,
});

export const ReaderMethodCtx = createContext({
  createRoom: () => {},
  scrollPage: (() => {}) as (pageId: string) => void,
  setInviewPages: (() => {}) as Dispatch<SetStateAction<Set<string>>>,
  switchPageMarked: (() => {}) as (pageId: string) => void,
  setPageOrder: (() => {}) as Dispatch<SetStateAction<string[] | undefined>>,
  setPageState: (() => {}) as (uid: string, ds: DrawState) => void,
  addPage: (() => {}) as (prevPageId: string, copy?: boolean) => void,
  addFinalPage: (() => {}) as () => void,
  deletePage: (() => {}) as (pageId: string) => void,
  setMode: (() => {}) as Dispatch<SetStateAction<CtrlMode>>,
  setDrawCtrl: (() => {}) as Dispatch<SetStateAction<DrawCtrl>>,
});

export default function Reader({ teamOn }: { teamOn: boolean }) {
  const noteId = useParams().noteId ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Record<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [mode, setMode] = useState<CtrlMode>("draw");
  const [saved, setSaved] = useState(true);
  const [pdfFile, setPdfFile] = useState<Blob>();
  const [inviewPages, setInviewPages] = useState(Set<string>());
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [loaded, setLoaded] = useState(false);
  const refRec = useRef<Record<string, HTMLDivElement>>({});
  const mounted = useMounted();

  const { teamStateSet, pushOperation, teamUpdate, updateNewPage } =
    useContext(TeamCtx);

  const loadNotePages = async () => {
    const storedNote = await loadNote(noteId);
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
    setPdfFile(pdf);
    if (teamOn) updatePages(noteId);
  };

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      await editNoteData(noteId, { pageRec: pr });
      const canvas = document.querySelector("canvas");
      const data = canvas?.toDataURL();
      data && editNoteData(noteId, { thumbnail: data });
      mounted.current && setSaved(true);
    }, 5000),
    []
  );
  const instantSave = debouncedSave.flush;

  const createRoom = async () => {
    await instantSave();
    const resCode = await putNote(noteId);
    if (!resCode) {
      message.error("Can't create room.");
      return;
    }
    await editNoteData(noteId, { team: true });
    nav("/team/" + noteId);
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
  }, [noteId, teamOn]);

  useBeforeunload(noteDestroy);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + ' - Multibility';
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
      await editNoteData(noteId, { pageOrder });
      await instantSave();
      const teamOrder = teamUpdate?.pageOrder;
      if (teamOn && JSON.stringify(pageOrder) !== JSON.stringify(teamOrder)) {
        updatePages(noteId);
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
      let { pageId, newPage } = teamUpdate;
      setPageRec((prev) => prev && { ...prev, [pageId]: newPage });
      setStateSet((prev) => prev?.addState(pageId, newPage, WIDTH));
    }
  }, [teamUpdate]);

  const updatePageRec = (pageId: string, ds: DrawState) => {
    const state = DrawState.flaten(ds);
    setPageRec(
      (prev) => prev && { ...prev, [pageId]: { ...prev[pageId], state } }
    );
  };

  const setPageState = useCallback((uid: string, ds: DrawState) => {
    setStateSet((prev) => prev?.setState(uid, ds));
    updatePageRec(uid, ds);
  }, []);

  const switchPageMarked = (pageId: string) => {
    const page = pageRec && pageRec[pageId];
    if (!page) return;
    const marked = !Boolean(page.marked);
    setPageRec(
      (prev) => prev && { ...prev, [pageId]: { ...prev[pageId], marked } }
    );
  };

  const handleUndo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.undo();
      updatePageRec(...newSS.getLastDs());
      return newSS;
    });
  };

  const handleRedo = () => {
    setStateSet((prev) => {
      if (!prev) return;
      const newSS = prev.redo();
      updatePageRec(...newSS.getLastDs());
      return newSS;
    });
  };

  const scrollPage = (pageId: string) => {
    refRec.current[pageId]?.scrollIntoView();
  };

  const addPage = (prevPageId: string, copy = false) => {
    const prevPage = copy ? pageRec && pageRec[prevPageId] : undefined;
    const [pageId, newPage] = createPage(prevPage);
    setPageOrder((prev) => {
      if (!prev) return;
      const newOrder = insertAfter(prev, prevPageId, pageId);
      updateNewPage && updateNewPage(newOrder, pageId, newPage);
      return newOrder;
    });
    setPageRec((prev) => prev && { ...prev, [pageId]: newPage });
    setStateSet((prev) => prev?.addState(pageId, newPage, WIDTH));
  };

  const addFinalPage = () => {
    const lastPageId = last(pageOrder);
    lastPageId && addPage(lastPageId);
  };

  const deletePage = (pageId: string) => {
    if (teamOn) {
      message.error("You can't delete pages from a team note.");
      return;
    }
    setPageOrder((prev) => prev?.filter((id) => id !== pageId));
    setPageRec((prev) => prev && omit(prev, pageId));
    setStateSet((prev) => prev?.deleteState(pageId));
  };

  const renderResult = (
    <div className="reader-container">
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
        noteId,
        noteInfo,
        stateSet,
        teamStateSet,
        saved,
        teamOn,
        pdfFile,
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
  const { pageRec, stateSet, teamStateSet } = useContext(ReaderStateCtx);
  const { setPageState } = useContext(ReaderMethodCtx);

  const page = pageRec && pageRec[uid];
  const drawState = stateSet?.getOneState(uid);
  const teamState = teamStateSet?.getOneState(uid);
  const updateState = useCallback(
    (ds: DrawState) => setPageState(uid, ds),
    [uid, setPageState]
  );
  if (!page || !drawState) return null;

  return (
    <PageWrapper
      drawState={drawState}
      teamState={teamState}
      updateState={updateState}
      thumbnail={page.image}
      pdfIndex={page.pdfIndex}
      uid={uid}
    />
  );
};

export const PageWrapper = React.memo(
  ({
    thumbnail,
    drawState,
    teamState,
    uid,
    pdfIndex,
    updateState,
    preview = false,
  }: {
    uid: string;
    drawState: DrawState;
    teamState?: DrawState;
    thumbnail?: string;
    pdfIndex?: number;
    updateState?: (ds: DrawState) => void;
    preview?: boolean;
  }) => {
    const { setInviewPages } = useContext(ReaderMethodCtx);
    const { pdfFile, refRec } = useContext(ReaderStateCtx);
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
          if (preview || !pdfFile || !pdfIndex || called) return;
          called = true;
          getOneImage(pdfFile, pdfIndex).then(setFullImg);
        };
      })(),
      [preview, pdfFile, pdfIndex]
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

    const otherStates = useMemo(() => teamState && [teamState], [teamState]);

    const maskShow = Boolean(preview || (pdfIndex && !fullImg));

    return (
      <section
        ref={handleRef}
        className="note-page"
        style={{ paddingTop: `${ratio * 100}%` }}
      >
        {visible && (
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
  }
);
PageWrapper.displayName = "PageWrapper";

const DrawWrapper = React.memo(
  ({
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

    function handleChange(fn: ((s: DrawState) => DrawState) | DrawState) {
      if (!updateState) return;
      let ds = fn instanceof DrawState ? fn : fn(drawState);
      updateState(ds);
    }

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
  }
);
DrawWrapper.displayName = "DrawWrapper";
