import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  CSSProperties,
} from "react";
import {
  Badge,
  Alert,
  Avatar,
  Button,
  Slider,
  Divider,
  message,
  Popover,
  Popconfirm,
  ButtonProps,
} from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { TeamCtx } from "./Team";
import DigitDisplay from "../ui/DigitDisplay";
import { colors, getHashedColor } from "../../lib/color";
import { getUserID, setUserName, UserInfo } from "../../lib/user";
import { CtrlMode, DrawCtrl } from "../../lib/draw/drawCtrl";
import PageNav from "./PageNav";
import {
  HomeFilled,
  EyeOutlined,
  FormOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  TeamOutlined,
  CopyOutlined,
  DragOutlined,
  CheckOutlined,
  ExpandOutlined,
  ReloadOutlined,
  DeleteOutlined,
  HighlightOutlined,
  DisconnectOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import IconFont from "../ui/IconFont";
import "./drawTools.sass";
import { putNote } from "../../lib/network/http";
import { editNoteData } from "../../lib/note/archive";
import { Setter } from "../../lib/hooks";
import classNames from "classnames";

export default function DrawTools({
  handleUndo,
  handleRedo,
  instantSave,
}: {
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}) {
  const { saved, stateSet, teamOn, mode, drawCtrl } =
    useContext(ReaderStateCtx);
  const { setDrawCtrl, setMode } = useContext(ReaderMethodCtx);
  const { finger } = drawCtrl;

  const nav = useNavigate();

  const updateDrawCtrl = (updated: Partial<DrawCtrl>) => {
    setDrawCtrl((prev) => ({ ...prev, ...updated }));
  };

  useEffect(() => {
    if (mode === "selected") {
      message.info({
        icon: <DragOutlined style={{ display: "none" }} />,
        content: <SelectMenu setMode={setMode} />,
        className: "select-message",
        key: "selected",
        duration: 0,
      });
      return () => message.destroy("selected");
    }
  }, [mode]);

  return (
    <header>
      <div className="left">
        <Button
          type="text"
          onClick={async () => {
            await instantSave();
            nav("/");
          }}
          icon={<HomeFilled style={{ opacity: 0.8 }} />}
        />
        <br />
        <Button
          type="text"
          className="save"
          onClick={instantSave}
          disabled={saved}
          icon={<SaveOutlined />}
        />
      </div>
      <div className="middle">
        <Button
          type="text"
          shape="circle"
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={!stateSet?.isUndoable()}
        />
        <Button
          className="redo"
          type="text"
          shape="circle"
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!stateSet?.isRedoable()}
        />
        <br />
        <PenButton updateDrawCtrl={updateDrawCtrl} />
        <EraserButton updateDrawCtrl={updateDrawCtrl} />
        <Button
          type={["select", "selected"].includes(mode) ? "default" : "text"}
          shape="circle"
          onClick={() => setMode("select")}
          icon={<ExpandOutlined />}
        />
        <Button
          className="finger"
          type={finger ? "primary" : "text"}
          ghost={finger}
          shape="circle"
          onClick={() => updateDrawCtrl({ finger: !finger })}
          icon={<IconFont type="icon-finger" />}
        />
      </div>
      <div className="right">
        {teamOn && <RoomInfo />}
        {teamOn || <JoinRoom instantSave={instantSave} />}
        <br />
        <PageNav />
      </div>
    </header>
  );
}

const PenButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const { mode } = useContext(ReaderStateCtx);
  const { setMode } = useContext(ReaderMethodCtx);
  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} />}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button type="default" shape="circle" icon={<HighlightOutlined />} />
    </Popover>
  ) : (
    <Button
      type="text"
      shape="circle"
      onClick={() => setMode("draw")}
      icon={<HighlightOutlined />}
    />
  );
};

const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const {
    drawCtrl: { lineWidth, highlight },
  } = useContext(ReaderStateCtx);
  const [tempLineWidth, setTempLineWidth] = useState(lineWidth);

  return (
    <div className="pen-panel">
      <div className="pen-status">
        <Slider
          min={5}
          max={100}
          value={tempLineWidth}
          onChange={setTempLineWidth}
          onAfterChange={(lineWidth) => updateDrawCtrl({ lineWidth })}
        />
        <Button
          type={highlight ? "primary" : "text"}
          ghost={highlight}
          shape="circle"
          icon={<IconFont type="icon-Highlight" />}
          onClick={() => updateDrawCtrl({ highlight: !highlight })}
        />
      </div>
      <ColorSelect updateDrawCtrl={updateDrawCtrl} />
    </div>
  );
};

const ColorSelect: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const {
    drawCtrl: { color },
  } = useContext(ReaderStateCtx);

  return (
    <div className="color-select">
      {colors.map((c) => (
        <label key={c}>
          <input
            checked={color === c}
            type="radio"
            name="color"
            onChange={() => updateDrawCtrl({ color: c })}
          />
          <div
            className="circle"
            style={{ "--circle-color": c } as CSSProperties}
          ></div>
        </label>
      ))}
    </div>
  );
};

const EraserButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const { setMode } = useContext(ReaderMethodCtx);
  const {
    mode,
    drawCtrl: { eraserWidth },
  } = useContext(ReaderStateCtx);
  const [tempEraserWidth, setTempEraserWidth] = useState(eraserWidth);

  const content = (
    <div className="pen-panel">
      <Slider
        min={5}
        max={100}
        value={tempEraserWidth}
        onChange={setTempEraserWidth}
        onAfterChange={(eraserWidth) => updateDrawCtrl({ eraserWidth })}
      />
    </div>
  );
  return mode === "erase" ? (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button
        type="default"
        shape="circle"
        icon={<IconFont type="icon-eraser" />}
      />
    </Popover>
  ) : (
    <Button
      type="text"
      shape="circle"
      onClick={() => setMode("erase")}
      icon={<IconFont type="icon-eraser" />}
    />
  );
};

const SelectMenu: FC<{
  setMode: Setter<CtrlMode>;
}> = ({ setMode }) => {
  const buttonProps: ButtonProps = {
    type: "text",
    shape: "round",
  };
  return (
    <>
      <Button icon={<RotateLeftOutlined />} {...buttonProps} />
      <Button icon={<RotateRightOutlined />} {...buttonProps} />
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => setMode("delete")}
        {...buttonProps}
      />
    </>
  );
};

const UserCard: FC<{ userInfo: UserInfo; self?: boolean }> = ({
  userInfo,
  self = false,
}) => {
  const { userName, userID, online } = userInfo;
  const { ignores, setIgnores, resetIO } = useContext(TeamCtx);
  const color = useMemo(() => getHashedColor(userID), [userID]);
  const ignored = ignores.has(userID) && !self;
  const [renaming, setRenaming] = useState(false);

  const switchIgnore = () => {
    setIgnores((prev) => {
      if (prev.has(userID)) return prev.delete(userID);
      return prev.add(userID);
    });
  };

  return (
    <div className={classNames("user-item", { online })}>
      <Avatar
        className="avatar"
        size="small"
        style={{ backgroundColor: color }}
      >
        {userName?.slice(0, 4)}
      </Avatar>
      {renaming || <span className="user-name">{userName}</span>}
      {renaming && (
        <Search
          autoFocus
          className="rename-input"
          defaultValue={userName}
          onSearch={(val) => {
            const name = val.trim();
            if (!name) return setRenaming(false);
            setUserName(name);
            resetIO();
            setRenaming(false);
          }}
          enterButton={<Button icon={<CheckOutlined />} />}
        />
      )}
      {self ? (
        renaming || (
          <Button
            type="text"
            icon={<FormOutlined />}
            onClick={() => setRenaming(true)}
          />
        )
      ) : (
        <Button
          type="text"
          icon={ignored ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={switchIgnore}
        />
      )}
    </div>
  );
};

function RoomInfo() {
  const { code, userRec, connected, loadInfo, resetIO } = useContext(TeamCtx);
  const link = window.location.href;
  const copy = () => {
    navigator.clipboard.writeText(link);
    message.destroy("copy");
    message.success({
      content: "Share link copied!",
      icon: <CopyOutlined />,
      key: "copy",
    });
  };

  const userList = useMemo(() => {
    const values = Object.values(userRec);
    const selfID = getUserID();
    const selfInfo = userRec[selfID];
    const list = selfInfo ? [selfInfo] : [];
    list.push(
      ...values.filter(({ online, userID }) => online && userID !== selfID),
      ...values.filter(({ online, userID }) => !online && userID !== selfID)
    );
    return list;
  }, [userRec]);
  const onlineNum = userList.filter((u) => u.online).length;

  const content = (
    <div className="team-popover">
      {connected || (
        <Alert
          className="disconn-alert"
          message="Network failed."
          icon={<DisconnectOutlined />}
          type="error"
          showIcon
          banner
        />
      )}
      <DigitDisplay value={code} />
      <Search
        className="copy-link code-font"
        value={link}
        enterButton={<Button icon={<CopyOutlined />} />}
        onSearch={copy}
      />
      <Divider />
      <div className="user-list">
        {userList.map((u) => (
          <UserCard
            key={u.userID}
            userInfo={u}
            self={u.userID === getUserID()}
          />
        ))}
      </div>
    </div>
  );

  const title = (
    <div className="team-title">
      <span>Team info</span>
      <Button
        shape="circle"
        type="text"
        size="small"
        icon={<ReloadOutlined />}
        onClick={() => {
          loadInfo();
          resetIO();
        }}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      title={title}
      defaultVisible
      getPopupContainer={(e) => e}
    >
      <Button
        type="text"
        icon={
          <Badge
            status={connected ? "success" : "error"}
            count={connected ? onlineNum : "!"}
            size="small"
          >
            <TeamOutlined />
          </Badge>
        }
      />
    </Popover>
  );
}

const JoinRoom: FC<{ instantSave: () => Promise<void> | undefined }> = ({
  instantSave,
}) => {
  const { noteID } = useContext(ReaderStateCtx);
  const nav = useNavigate();
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
  return (
    <Popconfirm
      placement="bottomRight"
      title="Enable team editing?"
      onConfirm={createRoom}
      okText="Yes"
      cancelText="No"
    >
      <Button type="text" icon={<UsergroupAddOutlined />} />
    </Popconfirm>
  );
};
