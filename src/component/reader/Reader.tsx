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
import "./reader.sass";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { debounce } from "lodash";
import DrawDisplay from "../draw/DrawDisplay";
import { putNote, updatePages } from "../../lib/network/http";
import dafaultImg from "../ui/default.png";
import DrawTools from "./DrawTools";
import { useBeforeunload } from "react-beforeunload";
import { LoadingOutlined } from "@ant-design/icons";
export const WIDTH = 2000;

const defaultDrawCtrl: DrawCtrl = {
  erasing: false,
  finger: false,
  even: true,
  lineWidth: 5,
  color: "#000",
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

  const [pageRecord, setPageRecord] = useState<Record<string, NotePage>>();
  const [note, setNote] = useState<Note>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [saved, setSaved] = useState(true);

  const loadNotePages = async () => {
    const storedNote = await loadNote(noteId);
    if (!storedNote) {
      message.error("Note not found");
      return nav("/");
    }
    const { pages } = storedNote;
    setPageRecord(pages);
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
    if (!note || !pageRecord) return;
    const resCode = await putNote(noteId, note, pageRecord);
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
    if (!pageRecord) return;
    debouncedSave(pageRecord);
    setSaved(false);
  }, [pageRecord]);

  const setPageState = useCallback((uid: string, ds: DrawState) => {
    setStateSet((prev) => prev?.setState(uid, ds));
    setPageRecord((prev) => {
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

  return (
    <DrawCtrlCtx.Provider value={drawCtrl}>
      <ReaderStateCtx.Provider value={{ noteId, stateSet, saved, teamOn }}>
        <ReaderMethodCtx.Provider value={{ setSaved, createRoom }}>
          <div className="reader-container">
            <DrawTools
              setDrawCtrl={setDrawCtrl}
              instantSave={instantSave}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
            />
            {stateSet?.getKeys().map((uid) => {
              if (!pageRecord) return <></>;
              const page = pageRecord[uid];
              const drawState = stateSet.getOneState(uid);
              const teamState = teamStateSet?.getOneState(uid);
              if (!page || !drawState) return <></>;
              return (
                <PageWrapper
                  drawState={drawState}
                  teamState={teamState}
                  updateState={setPageState}
                  imageBlob={page.image}
                  uid={uid}
                  key={uid}
                />
              );
            })}
            <LoadingOutlined className="page-loading" />
          </div>
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
    uid,
    updateState,
  }: {
    imageBlob?: Blob;
    drawState: DrawState;
    teamState: DrawState | undefined;
    uid: string;
    updateState: (uid: string, ds: DrawState) => void;
  }) => {
    const [loaded, setLoaded] = useState(false);

    const url = useMemo(
      () => (imageBlob ? URL.createObjectURL(imageBlob) : null),
      [imageBlob]
    );

    useEffect(() => {
      const prevUrl = url || "";
      return () => URL.revokeObjectURL(prevUrl);
    }, [url]);

    return (
      <div className={`pdf-page ${loaded ? "loaded" : ""}`}>
        <img
          src={url || dafaultImg}
          alt="pdf-page"
          onLoad={() => setLoaded(true)}
        />
        <div className="page-draw">
          {teamState && <DrawDisplay drawState={teamState} />}
          <DrawWrapper
            updateState={updateState}
            drawState={drawState}
            uid={uid}
          />
        </div>
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
  const drawCtrl = useContext(DrawCtrlCtx);

  function handleChange(fn: ((s: DrawState) => DrawState) | DrawState) {
    let ds = fn instanceof DrawState ? fn : fn(drawState);
    updateState(uid, ds);
  }

  return (
    <Draw
      drawState={drawState}
      onChange={handleChange}
      erasing={drawCtrl.erasing}
      lineWidth={drawCtrl.lineWidth}
    />
  );
};
