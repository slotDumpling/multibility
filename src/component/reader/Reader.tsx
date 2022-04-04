import { message } from "antd";
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Draw, { DrawCtrl } from "../draw/Draw";
import { DrawState } from "../../lib/draw/DrawState";
import { createPage, NoteInfo, NotePage } from "../../lib/note/note";
import { StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { debounce, last, omit } from "lodash";
import { putNote, updatePages } from "../../lib/network/http";
import { useBeforeunload } from "react-beforeunload";
import DrawTools from "./DrawTools";
import dafaultImg from "../ui/default.png";
import { getOneImage } from "../../lib/note/pdfImage";
import { useInView } from "react-intersection-observer";
import { Set } from "immutable";
import { insertAfter } from "../../lib/array";
import { AddPageButton } from "./ReaderTools";
import { useObjectUrl } from "../../lib/hooks";
import { TeamCtx } from "./Team";
import "./reader.sass";

export const WIDTH = 2000;

const defaultDrawCtrl: DrawCtrl = {
  erasing: false,
  finger: false,
  even: true,
  lineWidth: 10,
  color: "#000000",
  highlight: false,
};
export const DrawCtrlCtx = createContext(defaultDrawCtrl);
export const ReaderStateCtx = createContext({
  noteId: "",
  noteInfo: undefined as NoteInfo | undefined,
  stateSet: undefined as StateSet | undefined,
  teamStateSet: undefined as StateSet | undefined,
  pdfUrl: undefined as string | undefined,
  pageRec: undefined as Record<string, NotePage> | undefined,
  pageOrder: undefined as string[] | undefined,
  saved: true,
  teamOn: false,
  inviewPages: Set<string>(),
  refRec: {} as Record<string, HTMLDivElement>,
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
});

export default function Reader({ teamOn }: { teamOn: boolean }) {
  const noteId = useParams().noteId ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Record<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [saved, setSaved] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [inviewPages, setInviewPages] = useState(Set<string>());
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [loaded, setLoaded] = useState(false);
  const refRec = useRef<Record<string, HTMLDivElement>>({});

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
    setLoaded(true);
    if (pdf) setPdfUrl(URL.createObjectURL(pdf));
    if (teamOn) updatePages(noteId);
  };

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      await editNoteData(noteId, { pageRec: pr });
      setSaved(true);
    }, 1000),
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

  useEffect(() => {
    noteInit();
    return noteDestroy;
  }, [noteId, teamOn]);

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name;
  }, [noteInfo]);

  useBeforeunload(noteDestroy);

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
      const { pageId, newPage } = teamUpdate;
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
        setDrawCtrl={setDrawCtrl}
        instantSave={instantSave}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
      />
      <main>
        {pageOrder?.map((uid, index) => (
          <PageContainer uid={uid} pageIndex={index} key={uid} />
        ))}
        <AddPageButton />
      </main>
    </div>
  );

  return (
    <DrawCtrlCtx.Provider value={drawCtrl}>
      <ReaderStateCtx.Provider
        value={{
          noteId,
          noteInfo,
          stateSet,
          teamStateSet,
          saved,
          teamOn,
          pdfUrl,
          pageRec,
          pageOrder,
          inviewPages,
          refRec: refRec.current,
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
          }}
        >
          {renderResult}
        </ReaderMethodCtx.Provider>
      </ReaderStateCtx.Provider>
    </DrawCtrlCtx.Provider>
  );
}

const PageContainer: FC<{
  uid: string;
  pageIndex: number;
}> = ({ uid, pageIndex }) => {
  const { pageRec, stateSet, teamStateSet, pdfUrl, refRec } =
    useContext(ReaderStateCtx);
  const { setPageState } = useContext(ReaderMethodCtx);

  const page = pageRec && pageRec[uid];
  const drawState = stateSet?.getOneState(uid);
  const teamState = teamStateSet?.getOneState(uid);
  if (!page || !drawState) return null;

  return (
    <PageWrapper
      drawState={drawState}
      teamState={teamState}
      updateState={setPageState}
      imageBlob={page.image}
      pdfUrl={pdfUrl}
      pdfIndex={page.pdfIndex}
      uid={uid}
      refRec={refRec}
    />
  );
};

export const PageWrapper = React.memo(
  ({
    imageBlob,
    drawState,
    teamState,
    uid,
    pdfUrl,
    pdfIndex,
    updateState,
    refRec,
    preview = false,
  }: {
    uid: string;
    drawState: DrawState;
    teamState?: DrawState;
    imageBlob?: Blob;
    pdfUrl?: string;
    pdfIndex?: number;
    updateState?: (uid: string, ds: DrawState) => void;
    refRec?: Record<string, HTMLDivElement>;
    preview?: boolean;
  }) => {
    const { setInviewPages } = useContext(ReaderMethodCtx);
    const [loaded, setLoaded] = useState(false);
    const [realImage, setRealImage] = useState<Blob>();
    const [visibleRef, visible] = useInView({ delay: 100 });
    const thumbnailUrl = useObjectUrl(imageBlob);
    const imgUrl = useObjectUrl(realImage);

    const handleRef = useCallback(
      (e: HTMLDivElement | null) => {
        if (!e) return;
        visibleRef(e);
        if (refRec) refRec[uid] = e;
      },
      [refRec]
    );

    const loadImage = useCallback(
      (() => {
        let called = false;
        return () => {
          if (preview || !pdfUrl || !pdfIndex || called) {
            return;
          }
          called = true;
          getOneImage(pdfUrl, pdfIndex).then(setRealImage);
        };
      })(),
      [preview, pdfUrl, pdfIndex]
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

    const TeamDraw = teamState && (
      <Draw drawState={teamState} readonly preview={preview} />
    );

    const SelfDraw = preview ? (
      <Draw drawState={drawState} readonly preview />
    ) : (
      <DrawWrapper
        updateState={updateState}
        drawState={drawState}
        uid={uid}
        preview={preview}
      />
    );

    const maskShow = Boolean(preview || (pdfIndex && !imgUrl));

    return (
      <section
        ref={handleRef}
        className={`note-page${loaded ? " loaded" : ""}`}
      >
        <img
          src={imgUrl || thumbnailUrl || dafaultImg}
          alt="pdf-page"
          onLoad={() => setLoaded(true)}
        />
        {visible && (
          <div className="page-draw">
            {TeamDraw}
            {SelfDraw}
          </div>
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
    uid,
    updateState,
    preview = false,
  }: {
    drawState: DrawState;
    uid: string;
    updateState?: (uid: string, ds: DrawState) => void;
    preview?: boolean;
  }) => {
    const drawCtrl = useContext(DrawCtrlCtx);

    function handleChange(fn: ((s: DrawState) => DrawState) | DrawState) {
      if (!updateState) return;
      let ds = fn instanceof DrawState ? fn : fn(drawState);
      updateState(uid, ds);
    }

    return (
      <Draw
        drawState={drawState}
        onChange={handleChange}
        readonly={!updateState}
        preview={preview}
        {...drawCtrl}
      />
    );
  }
);
DrawWrapper.displayName = "DrawWrapper";
