import { Button, message, Popconfirm, Popover, Slider } from "antd";
import {
  LeftOutlined,
  UndoOutlined,
  RedoOutlined,
  HighlightOutlined,
  TeamOutlined,
  HighlightFilled,
  FormatPainterFilled,
  FormatPainterOutlined,
  SaveOutlined,
} from "@ant-design/icons";
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
import { DrawState, Stroke } from "../../lib/draw/DrawState";
import { NoteInfo, NotePage } from "../../lib/note/note";
import "./reader.css";
import { StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { debounce } from "lodash";
import DrawDisplay from "../draw/DrawDisplay";
import { putNote } from "../../lib/http/http";
import { RoomCode } from "./Team";
export const WIDTH = 2000;

const defaultDrawCtrl: DrawCtrl = {
  erasing: false,
  finger: false,
  even: true,
  lineWidth: 5,
  color: "#000",
};
const DrawCtrlCtx = createContext(defaultDrawCtrl);
const StateCtx = createContext({
  noteId: "",
  stateSet: undefined as StateSet | undefined,
  saved: true,
  teamOn: false,
});
const StateUpdateCtx = createContext({
  setSaved: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

export default function Reader({
  teamOn,
  teamStateSet,
  pushStroke,
}: {
  teamOn: boolean;
  teamStateSet?: StateSet;
  pushStroke?: (pageId: string, stroke: Stroke) => void
}) {
  const noteId = useParams().noteId ?? "";
  const nav = useNavigate();

  const [pageRecord, setPageRecord] = useState<Record<string, NotePage>>({});
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [saved, setSaved] = useState(true);

  async function loadNotePages() {
    const storedNote = await loadNote(noteId);
    if (!storedNote) {
      message.error("Note not found");
      return nav("/");
    }
    const { pages, pdf, ...noteInfo } = storedNote;
    setPageRecord(pages);
    setNoteInfo(noteInfo);
    setStateSet(StateSet.createFromPages(pages, WIDTH));
  }

  const debouncedSave = useCallback(
    debounce(async (pr: Record<string, NotePage>) => {
      await editNoteData(noteId, { pages: pr });
      setSaved(true);
    }, 5000),
    []
  );
  const instantSave = debouncedSave.flush;

  const createRoom = async () => {
    if (!noteInfo) return;
    const resCode = await putNote(noteId, noteInfo, pageRecord);
    if (!resCode) return message.error("Can't create room.");
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

  const setPageState = useCallback(
    (uid: string, ds: DrawState) => {
      setStateSet((prev) => prev?.setState(uid, ds));
      setPageRecord((prev) => {
        const pr = {
          ...prev,
          [uid]: {
            ...prev[uid],
            state: DrawState.flaten(ds),
          },
        };
        debouncedSave(pr);
        return pr;
      });
      setSaved(false);

      const stroke = ds.getLastStroke();
      if (stroke && pushStroke) pushStroke(uid, stroke);
    },
    [debouncedSave]
  );

  function handleUndo() {
    setStateSet((prev) => prev?.undo());
  }

  function handleRedo() {
    setStateSet((prev) => prev?.redo());
  }

  return (
    <DrawCtrlCtx.Provider value={drawCtrl}>
      <StateCtx.Provider
        value={{ noteId, stateSet, saved, teamOn }}
      >
        <StateUpdateCtx.Provider value={{ setSaved }}>
          <div className="reader-wrapper">
            <DrawTools
              setDrawCtrl={setDrawCtrl}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              instantSave={instantSave}
              createRoom={createRoom}
            />
            {stateSet?.getKeys().map((uid) => {
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
          </div>
        </StateUpdateCtx.Provider>
      </StateCtx.Provider>
    </DrawCtrlCtx.Provider>
  );
}

const DrawTools = ({
  setDrawCtrl,
  handleUndo,
  handleRedo,
  instantSave,
  createRoom,
}: {
  setDrawCtrl: Dispatch<SetStateAction<DrawCtrl>>;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => void;
  createRoom: () => void;
}) => {
  const drawCtrl = useContext(DrawCtrlCtx);
  const nav = useNavigate();

  function updateDrawCtrl(updated: Partial<DrawCtrl>) {
    setDrawCtrl((prev) => ({ ...prev, ...updated }));
  }

  const { saved, stateSet, teamOn } = useContext(StateCtx);

  const PenPanel = (
    <div id="pen-panel">
      <Slider
        min={1}
        max={20}
        value={drawCtrl.lineWidth}
        onChange={(lineWidth) => updateDrawCtrl({ lineWidth })}
      />
    </div>
  );

  const PenButton = drawCtrl.erasing ? (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ erasing: false })}
      icon={<HighlightOutlined />}
    />
  ) : (
    <Popover content={PenPanel} trigger="click" placement="bottom">
      <Button type="text" icon={<HighlightFilled />} />
    </Popover>
  );

  return (
    <div id="tool-bar">
      <div id="left-buttons">
        <Button type="text" onClick={() => nav("/")} icon={<LeftOutlined />}>
          Back
        </Button>
        <Button
          type="text"
          onClick={instantSave}
          disabled={saved}
          icon={<SaveOutlined />}
        />
      </div>
      <div id="middle-buttons">
        <Button
          type="text"
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={!stateSet?.isUndoable()}
        />
        <Button
          id="redo-button"
          type="text"
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!stateSet?.isRedoable()}
        />
        {PenButton}
        <Button
          type="text"
          onClick={() => updateDrawCtrl({ erasing: true })}
          icon={
            drawCtrl.erasing ? (
              <FormatPainterFilled />
            ) : (
              <FormatPainterOutlined />
            )
          }
        />
      </div>
      <div id="right-buttons">
        {teamOn && <RoomCode />}
        {teamOn || <JoinRoom createRoom={createRoom} />}
      </div>
    </div>
  );
};



const JoinRoom = ({ createRoom }: { createRoom: () => void }) => {
  return (
    <Popconfirm
      placement="bottomRight"
      title="Enable team editing?"
      onConfirm={createRoom}
      okText="Yes"
      cancelText="No"
    >
      <Button shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
    </Popconfirm>
  );
};

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
      <div className={`pdf-page${loaded ? " loaded" : ""}`}>
        <img
          src={url || "/default.png"}
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
