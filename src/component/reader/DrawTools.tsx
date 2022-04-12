import { Avatar, Button, Divider, Popconfirm, Popover, Slider } from "antd";
import React, { Dispatch, SetStateAction, useContext, useMemo } from "react";
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
  ReloadOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import "./drawTools.sass";
import PageNav from "./PageNav";
import IconFont from "../ui/IconFont";
import { DrawCtrl } from "../../lib/draw/drawCtrl";

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
  const { erasing, finger } = useContext(DrawCtrlCtx);
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
          icon={<HomeFilled className="home-icon" />}
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
        <PenButton erasing={erasing} updateDrawCtrl={updateDrawCtrl} />
        <EraserButton erasing={erasing} updateDrawCtrl={updateDrawCtrl} />
        <Button
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

const PenButton = React.memo(
  ({
    erasing,
    updateDrawCtrl,
  }: {
    erasing: boolean;
    updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  }) => {
    return erasing ? (
      <Button
        type="text"
        shape="circle"
        onClick={() => updateDrawCtrl({ erasing: false })}
        icon={<HighlightOutlined />}
      />
    ) : (
      <Popover
        content={<PenPanel updateDrawCtrl={updateDrawCtrl} />}
        trigger="click"
        placement="bottom"
        getPopupContainer={(e) => e}
      >
        <Button type="default" shape="circle" icon={<HighlightOutlined />} />
      </Popover>
    );
  }
);

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
        <input
          key={c}
          checked={color === c}
          type="radio"
          name="color"
          onChange={() => updateDrawCtrl({ color: c })}
          style={{ borderColor: c, backgroundColor: c }}
        />
      ))}
    </div>
  );
};

const EraserButton = React.memo(
  ({
    erasing,
    updateDrawCtrl,
  }: {
    erasing: boolean;
    updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  }) => {
    const { lineWidth } = useContext(DrawCtrlCtx);

    const content = (
      <div className="pen-panel">
        <Slider
          min={5}
          max={100}
          value={lineWidth}
          onChange={(lineWidth) => updateDrawCtrl({ lineWidth })}
        />
      </div>
    );
    return erasing ? (
      <Popover
        content={content}
        trigger="click"
        placement="bottom"
        getPopupContainer={(e) => e}
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
        onClick={() => updateDrawCtrl({ erasing: true })}
        icon={<IconFont type="icon-eraser" />}
      />
    );
  }
);

const UserCard = ({ userInfo }: { userInfo: UserInfo }) => {
  const { userName } = userInfo;
  const color = useMemo(() => getHashedColor(userName), [userName]);

  return (
    <div className="user-card">
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

  const content = (
    <div className="team-popover">
      <DigitDisplay value={code} />
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
