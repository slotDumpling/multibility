import {
  Avatar,
  Button,
  Divider,
  Input,
  message,
  Popconfirm,
  Popover,
  Slider,
} from "antd";
import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { DrawCtrlCtx, ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { TeamCtx } from "./Team";
import DigitDisplay from "../ui/DigitDisplay";
import { colors, getHashedColor } from "../../lib/color";
import { UserInfo } from "../../lib/user";
import {
  HomeFilled,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  TeamOutlined,
  CopyOutlined,
  ExpandOutlined,
  ReloadOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import "./drawTools.sass";
import PageNav from "./PageNav";
import IconFont from "../ui/IconFont";
import { DrawCtrl } from "../../lib/draw/drawCtrl";
import Search from "antd/lib/input/Search";

export default function DrawTools({
  setDrawCtrl,
  handleUndo,
  handleRedo,
  instantSave,
}: {
  setDrawCtrl: Dispatch<SetStateAction<DrawCtrl>>;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => void;
}) {
  const { finger, mode } = useContext(DrawCtrlCtx);
  const { saved, stateSet, teamOn } = useContext(ReaderStateCtx);
  const nav = useNavigate();

  const updateDrawCtrl = (updated: Partial<DrawCtrl>) => {
    setDrawCtrl((prev) => ({ ...prev, ...updated }));
  };

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
          type={mode === "select" ? "default" : "text"}
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
  const { mode } = useContext(DrawCtrlCtx);
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
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      icon={<HighlightOutlined />}
    />
  );
};

const PenPanel = ({
  updateDrawCtrl,
}: {
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}) => {
  const { lineWidth, highlight } = useContext(DrawCtrlCtx);

  return (
    <div className="pen-panel">
      <div className="pen-status">
        <Slider
          min={5}
          max={100}
          value={lineWidth}
          onChange={(lineWidth) => updateDrawCtrl({ lineWidth })}
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
  const { color } = useContext(DrawCtrlCtx);

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
  const { eraserWidth, mode } = useContext(DrawCtrlCtx);

  const content = (
    <div className="pen-panel">
      <Slider
        min={5}
        max={100}
        value={eraserWidth}
        onChange={(eraserWidth) => updateDrawCtrl({ eraserWidth })}
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

const UserCard = ({ userInfo }: { userInfo: UserInfo }) => {
  const { userName } = userInfo;
  const color = useMemo(() => getHashedColor(userName), [userName]);

  return (
    <div className="user-item">
      <Avatar
        className="avatar"
        size="small"
        style={{ backgroundColor: color }}
      >
        {userName.slice(0, 4)}
      </Avatar>
      <span>{userName}</span>
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
