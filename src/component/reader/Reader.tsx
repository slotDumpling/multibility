import { message } from "antd";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Draw, { DrawCtrl } from "../draw/Draw";
import { DrawState } from "../../lib/draw/DrawState";
import { Note, NotePage } from "../../lib/note/note";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { debounce } from "lodash";
import { putNote, updatePages } from "../../lib/network/http";
import { useBeforeunload } from "react-beforeunload";
import { LoadingOutlined } from "@ant-design/icons";
import DrawTools from "./DrawTools";
import dafaultImg from "../ui/default.png";
import { getOneImage } from "../../lib/note/pdfImage";
import "./reader.sass";
import { useInView } from "react-intersection-observer";

export const WIDTH = 2000;

const defaultDrawCtrl: DrawCtrl = {
  erasing: false,
  finger: false,
  even: true,
  lineWidth: 10,
  color: "#000000",
};
export const DrawCtrlCtx = createContext(defaultDrawCtrl);
export const ReaderStateCtx = createContext({
  noteId: "",
  stateSet: undefined as StateSet | undefined,
  saved: true,
  teamOn: false,
});
export const ReaderMethodCtx = createContext({
  setSaved: (() => {}) as Dispatch<SetStateAction<boolean>>,
  createRoom: () => {},
});

export default function Reader({
  teamOn,
  teamStateSet,
  pushOperation,
}: {
  teamOn: boolean;
  teamStateSet?: StateSet;
  pushOperation?: (op: SetOperation) => void;
}) {
  const noteId = useParams().noteId ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Record<string, NotePage>>();
  const [note, setNote] = useState<Note>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [saved, setSaved] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>();

  const loadNotePages = async () => {
    const storedNote = await loadNote(noteId);
    if (!storedNote) {
      message.error("Note not found");
      return nav("/");
    }
    const { pages, pdf } = storedNote;
    setPageRec(pages);
    if (pdf) setPdfUrl(URL.createObjectURL(pdf));
    setNote(storedNote);
    setStateSet(StateSet.createFromPages(pages, WIDTH));
    if (teamOn) updatePages(noteId, pages);
  };

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      await editNoteData(noteId, { pages: pr });
      setSaved(true);
    }, 1000),
    []
  );
  const instantSave = debouncedSave.flush;

  const createRoom = async () => {
    if (!note || !pageRec) return;
    const resCode = await putNote(noteId, note, pageRec);
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
    if (!note) return;
    document.title = note.name;
  }, [note]);

  useBeforeunload(noteDestroy);

  useEffect(() => {
    if (!stateSet?.lastOp || !pushOperation) return;
    pushOperation(stateSet.lastOp);
  }, [stateSet]);

  useEffect(() => {
    if (!pageRec) return;
    debouncedSave(pageRec);
    setSaved(false);
  }, [pageRec]);

  const setPageState = useCallback((uid: string, ds: DrawState) => {
    setStateSet((prev) => prev?.setState(uid, ds));
    setPageRec((prev) => {
      if (!prev) return;
      return {
        ...prev,
        [uid]: { ...prev[uid], state: DrawState.flaten(ds) },
      };
    });
  }, []);

  const handleUndo = () => {
    setStateSet((prev) => prev?.undo());
  };

  const handleRedo = () => {
    setStateSet((prev) => prev?.redo());
  };

  const renderResult = (
    <div className="reader-container">
      <DrawTools
        setDrawCtrl={setDrawCtrl}
        instantSave={instantSave}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
      />
      {stateSet?.getKeys().map((uid, index) => {
        if (!pageRec) return <></>;
        const page = pageRec[uid];
        const drawState = stateSet.getOneState(uid);
        const teamState = teamStateSet?.getOneState(uid);
        if (!page || !drawState) return <></>;
        return (
          <PageWrapper
            drawState={drawState}
            teamState={teamState}
            updateState={setPageState}
            imageBlob={page.image}
            pdfUrl={pdfUrl}
            index={index}
            uid={uid}
            key={uid}
          />
        );
      })}
      <LoadingOutlined className="page-loading" />
    </div>
  );

  return (
    <DrawCtrlCtx.Provider value={drawCtrl}>
      <ReaderStateCtx.Provider value={{ noteId, stateSet, saved, teamOn }}>
        <ReaderMethodCtx.Provider value={{ setSaved, createRoom }}>
          {renderResult}
        </ReaderMethodCtx.Provider>
      </ReaderStateCtx.Provider>
    </DrawCtrlCtx.Provider>
  );
}

const PageWrapper = React.memo(
  ({
    imageBlob,
    drawState,
    teamState,
    pdfUrl,
    index,
    uid,
    updateState,
  }: {
    imageBlob?: Blob;
    drawState: DrawState;
    teamState: DrawState | undefined;
    pdfUrl?: string;
    index: number;
    uid: string;
    updateState: (uid: string, ds: DrawState) => void;
  }) => {
    const [loaded, setLoaded] = useState(false);
    const [realImage, setRealImage] = useState<Blob>();

    const [lazyImg, inView] = useInView({
      delay: 100,
    });

    const thumbnailUrl = useMemo(
      () => (imageBlob ? URL.createObjectURL(imageBlob) : null),
      [imageBlob]
    );

    useEffect(() => {
      const prevUrl = thumbnailUrl || "";
      return () => URL.revokeObjectURL(prevUrl);
    }, [thumbnailUrl]);

    const imgUrl = useMemo(
      () => (realImage ? URL.createObjectURL(realImage) : null),
      [realImage]
    );

    useEffect(() => {
      const prevUrl = imgUrl || "";
      return () => URL.revokeObjectURL(prevUrl);
    }, [imgUrl]);

    const loadImage = async () => {
      if (!pdfUrl || realImage) return;
      setRealImage(await getOneImage(pdfUrl, index));
    };

    useEffect(() => {
      if (inView) loadImage();
    }, [inView]);

    return (
      <div className={`pdf-page ${loaded ? "loaded" : ""}`}>
        <img
          ref={lazyImg}
          className={imgUrl ? undefined : "thumbnail"}
          src={imgUrl || thumbnailUrl || dafaultImg}
          alt="pdf-page"
          onLoad={() => setLoaded(true)}
        />
        {inView && (
          <div className="page-draw">
            {teamState && <Draw drawState={teamState} />}
            <DrawWrapper
              updateState={updateState}
              drawState={drawState}
              uid={uid}
            />
          </div>
        )}
      </div>
    );
  }
);

const DrawWrapper = ({
  drawState,
  uid,
  updateState,
}: {
  drawState: DrawState;
  uid: string;
  updateState: (uid: string, ds: DrawState) => void;
}) => {
  const { erasing, lineWidth, color, finger } = useContext(DrawCtrlCtx);

  function handleChange(fn: ((s: DrawState) => DrawState) | DrawState) {
    let ds = fn instanceof DrawState ? fn : fn(drawState);
    updateState(uid, ds);
  }

  return (
    <Draw
      drawState={drawState}
      onChange={handleChange}
      erasing={erasing}
      lineWidth={lineWidth}
      color={color}
      finger={finger}
    />
  );
};
