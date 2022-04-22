import React, {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Avatar,
  Button,
  ButtonProps,
  Divider,
  message,
  Popconfirm,
  Popover,
  Slider,
} from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { TeamCtx } from "./Team";
import DigitDisplay from "../ui/DigitDisplay";
import { colors, getHashedColor } from "../../lib/color";
import { getUserId, UserInfo } from "../../lib/user";
import { CtrlMode, DrawCtrl } from "../../lib/draw/drawCtrl";
import PageNav from "./PageNav";
import {
  HomeFilled,
  EyeOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  TeamOutlined,
  UserOutlined,
  CopyOutlined,
  DragOutlined,
  ExpandOutlined,
  ReloadOutlined,
  DeleteOutlined,
  HighlightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import IconFont from "../ui/IconFont";
import "./drawTools.sass";

export default function DrawTools({
  handleUndo,
  handleRedo,
  instantSave,
}: {
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => void;
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
        className: "select-message",
        icon: <DragOutlined style={{ display: "none" }} />,
        content: <SelectMenu setMode={setMode} />,
        duration: 0,
        key: "selected",
      });
      return () => message.destroy("selected");
    }
  }, [mode]);

  return (
    <header>
      <div className="left">
        <Button
          type="text"
          onClick={() => nav("/")}
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
        {teamOn || <JoinRoom />}
        <br />
        <PageNav />
      </div>
    </header>
  );
}

const PenButton = ({
  updateDrawCtrl,
}: {
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}) => {
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

const PenPanel = ({
  updateDrawCtrl,
}: {
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}) => {
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

const ColorSelect = ({
  updateDrawCtrl,
}: {
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}) => {
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

const EraserButton = ({
  updateDrawCtrl,
}: {
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}) => {
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
  setMode: Dispatch<SetStateAction<CtrlMode>>;
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

const UserCard: FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
  const { userName, userId } = userInfo;
  const { ignores, setIgnores } = useContext(TeamCtx);
  const color = useMemo(() => getHashedColor(userName), [userName]);
  const self = userId === getUserId();
  const ignored = ignores.has(userId) && !self;

  const switchIgnore = () => {
    setIgnores((prev) => {
      if (prev.has(userId)) return prev.delete(userId);
      return prev.add(userId);
    });
  };

  const icon = self ? (
    <UserOutlined />
  ) : ignored ? (
    <EyeInvisibleOutlined />
  ) : (
    <EyeOutlined />
  );

  return (
    <div className="user-item">
      <Avatar
        className="avatar"
        size="small"
        style={{ backgroundColor: color }}
      >
        {userName.slice(0, 4)}
      </Avatar>
      <span className="user-name">{userName}</span>
      <Button disabled={self} type="text" icon={icon} onClick={switchIgnore} />
    </div>
  );
};

function RoomInfo() {
  const { code, userList, loadInfo } = useContext(TeamCtx);
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

  const content = (
    <div className="team-popover">
      <DigitDisplay value={code} />
      <Search
        className="copy-link"
        value={link}
        enterButton={<Button icon={<CopyOutlined />} />}
        onSearch={copy}
      />
      <Divider />
      <div className="user-list">
        {userList.map((u) => (
          <UserCard key={u.userId} userInfo={u} />
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
        onClick={loadInfo}
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
      <Button type="text" icon={<TeamOutlined />} />
    </Popover>
  );
}

const JoinRoom = () => {
  const { createRoom } = useContext(ReaderMethodCtx);
  return (
    <Popconfirm
      placement="bottomRight"
      title="Enable team editing?"
      onConfirm={createRoom}
      okText="Yes"
      cancelText="No"
    >
      <Button type="text" icon={<TeamOutlined />} />
    </Popconfirm>
  );
};
