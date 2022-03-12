import { Avatar, Button, Divider, Popconfirm, Popover, Slider } from "antd";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DrawCtrl } from "../draw/Draw";
import { DrawCtrlCtx, ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import {
  LeftOutlined,
  UndoOutlined,
  RedoOutlined,
  HighlightOutlined,
  SaveOutlined,
  TeamOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import "./drawTools.sass";
import { TeamStateCtx } from "./Team";
import DigitDisplay from "../ui/DigitDisplay";
import { colors, getRandomColor } from "../../lib/color";
import { UserInfo } from "../../lib/user";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3181679_dsms7mr75hd.js",
});

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
    <div className="tool-bar">
      <div className="left-buttons">
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
      <div className="middle-buttons">
        <Button
          type="text"
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={!stateSet?.isUndoable()}
        />
        <Button
          className="redo-button"
          type="text"
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!stateSet?.isRedoable()}
        />
        <PenButton erasing={erasing} updateDrawCtrl={updateDrawCtrl} />
        <Button
          type={erasing ? "default" : "text"}
          shape="circle"
          onClick={() => updateDrawCtrl({ erasing: true })}
          icon={<IconFont type="icon-eraser" />}
        />
        <Button
          type={finger ? "primary" : "text"}
          ghost={finger}
          shape="circle"
          onClick={() => updateDrawCtrl({ finger: !finger })}
          icon={<IconFont type="icon-finger" />}
        />
      </div>
      <div className="right-buttons">
        {teamOn && <RoomInfo />}
        {teamOn || <JoinRoom />}
      </div>
    </div>
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
        getPopupContainer={(e) => {
          return e.parentElement?.parentElement || e;
        }}
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
  const { lineWidth } = useContext(DrawCtrlCtx);

  return (
    <div className="pen-panel">
      <Slider
        min={5}
        max={50}
        value={lineWidth}
        onChange={(lineWidth) => updateDrawCtrl({ lineWidth })}
      />
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

const UserCard = ({ userInfo }: { userInfo: UserInfo }) => {
  const { userName } = userInfo;
  return (
    <div className="user-card">
      <Avatar
        className="avatar"
        size="small"
        style={{ backgroundColor: getRandomColor() }}
      >
        {userName.slice(0, 4)}
      </Avatar>
      <span>{userName}</span>
    </div>
  );
};

function RoomInfo() {
  const { code, userList } = useContext(TeamStateCtx);

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

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      title="Team info"
      defaultVisible
      getPopupContainer={(e) => {
        return e.parentElement?.parentElement || e;
      }}
    >
      <Button shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
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
      <Button shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
    </Popconfirm>
  );
};
