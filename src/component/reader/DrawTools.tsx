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
} from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { TeamCtx } from "./Team";
import DigitDisplay from "../ui/DigitDisplay";
import { colors, getHashedColor } from "../../lib/color";
import { getUserID, saveUserName } from "../../lib/user";
import { DrawCtrl, saveDrawCtrl } from "../../lib/draw/drawCtrl";
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
  CheckOutlined,
  ExpandOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  HighlightOutlined,
  DisconnectOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import IconFont from "../ui/IconFont";
import "./drawTools.sass";
import { putNote } from "../../lib/network/http";
import { editNoteData } from "../../lib/note/archive";
import classNames from "classnames";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import copy from "clipboard-copy";

export default function DrawTools({
  handleUndo,
  handleRedo,
  instantSave,
}: {
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}) {
  const { saved, stateSet, teamOn, drawCtrl } = useContext(ReaderStateCtx);
  const { mode } = drawCtrl;
  const { setDrawCtrl } = useContext(ReaderMethodCtx);
  const { finger } = drawCtrl;

  const nav = useNavigate();

  const updateDrawCtrl = (updated: Partial<DrawCtrl>) => {
    setDrawCtrl((prev) => {
      const newCtrl = { ...prev, ...updated };
      saveDrawCtrl(newCtrl);
      return newCtrl;
    });
  };

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
          onClick={() => updateDrawCtrl({ mode: "select" })}
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
  const { drawCtrl } = useContext(ReaderStateCtx);
  const { mode } = drawCtrl;
  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} drawCtrl={drawCtrl} />}
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
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      icon={<HighlightOutlined />}
    />
  );
};

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: DrawCtrl;
}> = ({ updateDrawCtrl, drawCtrl }) => {
  const { lineWidth, highlight, color } = drawCtrl;
  const [tempLineWidth, setTempLineWidth] = useState(lineWidth);

  return (
    <div className="pen-panel">
      <div className="pen-status">
        <Slider
          min={5}
          max={100}
          defaultValue={tempLineWidth}
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
      <ColorSelect updateDrawCtrl={updateDrawCtrl} color={color} />
    </div>
  );
};

const ColorSelect: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  color: string;
}> = ({ updateDrawCtrl, color }) => {
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
  const {
    drawCtrl: { eraserWidth, mode },
  } = useContext(ReaderStateCtx);
  const [tempEraserWidth, setTempEraserWidth] = useState(eraserWidth);

  const content = (
    <div className="pen-panel">
      <Slider
        min={5}
        max={100}
        defaultValue={tempEraserWidth}
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
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      icon={<IconFont type="icon-eraser" />}
    />
  );
};

const UserCard: FC<{ userID: string }> = ({ userID }) => {
  const [renaming, setRenaming] = useState(false);
  const { ignores, setIgnores, resetIO, userRec } = useContext(TeamCtx);
  const userInfo = userRec[userID];
  useEffect(() => setRenaming(false), [userInfo]);
  if (!userInfo) return null;

  const { userName, online } = userInfo;
  const self = userID === getUserID();
  const ignored = ignores.has(userID) && !self;

  const switchIgnore = () => {
    setIgnores((prev) => {
      if (prev.has(userID)) return prev.delete(userID);
      return prev.add(userID);
    });
  };

  const submitRename = (value: string) => {
    const name = value.trim();
    if (!name || name === userName) return setRenaming(false);
    saveUserName(name);
    resetIO();
  };

  return (
    <div className={classNames("user-item", { online })}>
      <UserAvatar userID={userID} size="small" className="room-avatar" />
      {renaming || <span className="user-name">{userName}</span>}
      {renaming && (
        <Search
          autoFocus
          className="rename-input"
          defaultValue={userName}
          onSearch={submitRename}
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

export const UserAvatar: FC<{
  userID: string;
  size?: AvatarSize;
  onClick?: () => void;
  chosen?: boolean;
  className?: string;
}> = ({
  userID,
  size = "default",
  onClick = () => {},
  chosen = false,
  className,
}) => {
  const { userRec } = useContext(TeamCtx);
  const color = useMemo(() => getHashedColor(userID), [userID]);
  const userInfo = userRec[userID];
  if (!userInfo) return null;
  const { userName } = userInfo;

  return (
    <Avatar
      className={classNames(className, { chosen })}
      size={size}
      style={{ backgroundColor: color }}
    >
      <div
        className="avatar-wrapper"
        onClickCapture={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {userName?.slice(0, 3)}
      </div>
    </Avatar>
  );
};

const RoomInfo: FC = () => {
  const { code, userRec, connected, loadInfo, resetIO } = useContext(TeamCtx);
  const link = window.location.href;
  const share = async () => {
    const selfName = userRec[getUserID()]?.userName;
    try {
      await copy(`${selfName} shared a note with you at 𝐌𝐮𝐥𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲.\n${link}`);
      message.destroy("copy");
      message.success({
        content: "Share link copied!",
        icon: <CopyOutlined />,
        key: "copy",
      });
    } catch (e) {
      console.log(e);
    }
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
      <Button
        icon={<ShareAltOutlined />}
        className="share-btn"
        onClick={share}
        block
      >
        Share
      </Button>
      <Divider />
      <div className="user-list">
        {userList.map((u) => (
          <UserCard key={u.userID} userID={u.userID} />
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
};

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
