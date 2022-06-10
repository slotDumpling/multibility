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
  Modal,
  Avatar,
  Button,
  Slider,
  Divider,
  message,
  Popover,
  ButtonProps,
} from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { PasscodeInput } from "antd-mobile";
import { ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { TeamCtx } from "./Team";
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
  ReloadOutlined,
  GatewayOutlined,
  ShareAltOutlined,
  HighlightOutlined,
  DisconnectOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import { editNoteData } from "../../lib/note/archive";
import { putNote } from "../../lib/network/http";
import IconFont from "../ui/IconFont";
import classNames from "classnames";
import copy from "clipboard-copy";
import "./readerHeader.sass";

export default function DrawTools({
  handleUndo,
  handleRedo,
  instantSave,
}: {
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}) {
  const { saved, stateSet, drawCtrl } = useContext(ReaderStateCtx);
  const { setDrawCtrl } = useContext(ReaderMethodCtx);
  const { teamOn } = useContext(TeamCtx);
  const { mode, finger } = drawCtrl;

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
        <div className="br" />
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
          type="text"
          shape="circle"
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!stateSet?.isRedoable()}
        />
        <Button
          type={finger ? "default" : "text"}
          shape="circle"
          onClick={() => {
            updateDrawCtrl({ finger: !finger });
            message.destroy("FINGER");
            message.open({
              content: finger ? "Pencil only" : "Draw with finger",
              key: "FINGER",
            });
          }}
          icon={<IconFont type="icon-finger" />}
        />
        <div className="br" />
        <PenButton updateDrawCtrl={updateDrawCtrl} />
        <EraserButton updateDrawCtrl={updateDrawCtrl} />
        <Button
          type={mode === "text" ? "default" : "text"}
          shape="circle"
          onClick={() => updateDrawCtrl({ mode: "text" })}
          icon={<IconFont type="icon-text1" />}
        />
        <SelectButton updateDrawCtrl={updateDrawCtrl} />
      </div>
      <div className="right">
        {teamOn && <RoomInfo />}
        {teamOn || <JoinRoom instantSave={instantSave} />}
        <div className="br" />
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

  const btnProps: ButtonProps = {
    className: "pen",
    shape: "circle",
    icon: <HighlightOutlined />,
  };
  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} drawCtrl={drawCtrl} />}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button type="default" {...btnProps} />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      {...btnProps}
    />
  );
};

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
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
      <ColorSelect
        color={color || ""}
        setColor={(c) => updateDrawCtrl({ color: c })}
      />
    </div>
  );
};

export const ColorSelect: FC<{
  color: string;
  setColor: (color: string) => void;
}> = ({ setColor, color }) => {
  return (
    <div className="color-select">
      {colors.map((c) => (
        <label key={c}>
          <input
            checked={color === c}
            type="radio"
            name="color"
            onChange={() => setColor(c)}
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

  const btnProps: ButtonProps = {
    shape: "circle",
    icon: <IconFont type="icon-eraser" />,
  };

  return mode === "erase" ? (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button type="default" {...btnProps} />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      {...btnProps}
    />
  );
};

const SelectButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const {
    drawCtrl: { lasso, mode },
  } = useContext(ReaderStateCtx);

  const icon = lasso ? <IconFont type="icon-lasso1" /> : <GatewayOutlined />;

  return mode === "select" ? (
    <Button
      type="default"
      shape="circle"
      icon={icon}
      onClick={() => updateDrawCtrl({ lasso: !lasso })}
    />
  ) : (
    <Button
      type="text"
      shape="circle"
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
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
      <div className="avatar-wrapper" onClick={onClick}>
        {userName?.slice(0, 3)}
      </div>
    </Avatar>
  );
};

const RoomInfo: FC = () => {
  const { code, userRec, connected, loadInfo, loadState, resetIO } =
    useContext(TeamCtx);
  const { noteInfo } = useContext(ReaderStateCtx);
  const link = window.location.href;
  const share = async () => {
    const selfName = userRec[getUserID()]?.userName;
    try {
      if (!noteInfo) return;
      await copy(`${noteInfo.name} - ${selfName} - Multibility\n${link}`);
      message.destroy("copy");
      message.success({
        content: "Link copied!",
        icon: <CopyOutlined />,
        key: "copy",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const userList = useMemo(() => {
    const selfID = getUserID();
    const { [selfID]: selfInfo, ...otherUsers } = userRec;
    const list = selfInfo ? [selfInfo] : [];
    const values = Object.values(otherUsers);
    list.push(
      ...values.filter(({ online }) => online),
      ...values.filter(({ online }) => !online)
    );
    return list;
  }, [userRec]);

  const onlineNum = useMemo(
    () => userList.filter(({ online }) => online).length,
    [userList]
  );

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
      <PasscodeInput
        className="code-display"
        value={String(code)}
        length={4}
        plain
      />
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

  const [reloading, setReloading] = useState(false);
  const title = (
    <div className="team-title">
      <span>Team info</span>
      <Button
        shape="circle"
        type="text"
        size="small"
        loading={reloading}
        icon={<ReloadOutlined />}
        onClick={async () => {
          setReloading(true);
          await loadInfo();
          await loadState();
          setReloading(false);
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
    const res = await putNote(noteID);
    if (!res) return message.error("Can't create room.");
    await editNoteData(noteID, { team: true });
    nav("/team/" + noteID);
  };

  return (
    <Button
      type="text"
      icon={<UsergroupAddOutlined />}
      onClick={() => {
        Modal.confirm({
          title: "Enable team editing",
          content: "This will make your note public.",
          icon: <TeamOutlined style={{ color: "#555" }} />,
          onOk: createRoom,
        });
      }}
    />
  );
};
