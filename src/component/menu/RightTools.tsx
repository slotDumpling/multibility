import {
  Button,
  Input,
  Menu,
  message,
  Popconfirm,
  Popover,
  Progress,
} from "antd";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createNewNote } from "../../lib/note/archive";
import { LoadPDF } from "../../lib/note/pdfImage";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  TeamOutlined,
  UserOutlined,
  ClearOutlined,
  InboxOutlined,
  FilePdfOutlined,
  SettingOutlined,
  CaretDownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getNoteId, loadTeamNote } from "../../lib/network/http";
import DigitInput from "../ui/DigitInput";
import { CSSTransition } from "react-transition-group";
import "./right.sass";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";
import { getUserName, setUserName } from "../../lib/user";
import localforage from "localforage";
import { useEffect } from "react";

const OthersStateUpdateCtx = createContext({
  setActive: (() => {}) as Dispatch<SetStateAction<string>>,
});

export default function RightTools() {
  return (
    <div className="right-tools">
      <JoinTeamButton />
      <OthersButton />
    </div>
  );
}

const OthersMenu = () => {
  const { setActive } = useContext(OthersStateUpdateCtx);
  const { Item } = Menu;
  return (
    <Menu onClick={({ key }) => setActive(key)}>
      <Item key="PDF">
        <FilePdfOutlined />
        <span>Load PDF</span>
      </Item>
      <Item key="PROFILE">
        <UserOutlined />
        <span>My profile</span>
      </Item>
      <Item key="SETTINGS">
        <SettingOutlined />
        <span>Settings</span>
      </Item>
    </Menu>
  );
};

const SeconaryMenu = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const { setActive } = useContext(OthersStateUpdateCtx);
  return (
    <div className="secondary">
      <div className="title">
        <Button
          type="text"
          shape="circle"
          onClick={() => setActive("MENU")}
          icon={<ArrowLeftOutlined />}
        />
        <Title level={5}>{title}</Title>
      </div>
      {children}
    </div>
  );
};

function UploadPdfPage() {
  const [loading, setLoading] = useState(false);
  const { tagUid } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);
  const [percent, setPercent] = useState(0);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") return;
    setLoading(true);
    const note = await LoadPDF(file, setPercent);
    note.tagId = tagUid;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
    setLoading(false);
    message.success("PDF Loaded");
    return false;
  }

  return (
    <SeconaryMenu title="Load PDF">
      <Dragger
        disabled={loading}
        multiple={false}
        action="#"
        accept="application/pdf"
        beforeUpload={handleFile}
      >
        <p className="ant-upload-drag-icon">
          {loading ? (
            <Progress width={48} type="circle" percent={percent} />
          ) : (
            <InboxOutlined />
          )}
        </p>
        <p className="ant-upload-hint">Click or drag a pdf file here.</p>
      </Dragger>
    </SeconaryMenu>
  );
}

const ProfilePage = () => {
  const userName = getUserName();
  const [name, setName] = useState(userName);
  const handleEnter = () => {
    setUserName(name);
  };
  return (
    <SeconaryMenu title="My profile">
      <div className="profile-page">
        <Input
          prefix={<UserOutlined />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleEnter} type="primary" block>
          OK
        </Button>
      </div>
    </SeconaryMenu>
  );
};

const SettingsPage = () => {
  const { Item } = Menu;
  const { menuInit } = useContext(MenuMethodCtx);

  const clearAll = async () => {
    await localforage.clear();
    menuInit();
  };

  return (
    <SeconaryMenu title="Settings">
      <Menu>
        <Popconfirm
          title="Delete all notes and tags?"
          onConfirm={clearAll}
          icon={<ClearOutlined />}
          okText="Yes"
          okType="danger"
          cancelText="No"
          placement="left"
        >
          <Item key="CLEAR" danger>
            <ClearOutlined />
            <span>Clear all</span>
          </Item>
        </Popconfirm>
      </Menu>
    </SeconaryMenu>
  );
};

const OthersPage = () => {
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState("");

  const calcHeight = (el: HTMLElement) => {
    setHeight(el.clientHeight);
  };

  const cssProps = {
    timeout: 300,
    onEnter: calcHeight,
    unmountOnExit: true,
  };

  const cssProps2 = {
    ...cssProps,
    classNames: "secondary",
  };

  useEffect(() => setActive("MENU"), []);

  return (
    <OthersStateUpdateCtx.Provider value={{ setActive }}>
      <section className="others-menu" style={{ height }}>
        <CSSTransition
          classNames="primary"
          in={active === "MENU"}
          {...cssProps}
        >
          <OthersMenu />
        </CSSTransition>
        <CSSTransition in={active === "PDF"} {...cssProps2}>
          <UploadPdfPage />
        </CSSTransition>
        <CSSTransition in={active === "PROFILE"} {...cssProps2}>
          <ProfilePage />
        </CSSTransition>
        <CSSTransition in={active === "SETTINGS"} {...cssProps2}>
          <SettingsPage />
        </CSSTransition>
      </section>
    </OthersStateUpdateCtx.Provider>
  );
};

const OthersButton = () => {
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={<OthersPage />}
      zIndex={900}
    >
      <Button shape="circle" icon={<CaretDownOutlined />} />
    </Popover>
  );
};

function JoinTeamButton() {
  const [roomCode, setRoomCode] = useState(0);

  const nav = useNavigate();
  async function handleSubmit(code: number) {
    const dismiss = message.loading("Loading team note...", 0);
    const noteId = await getNoteId(code);
    if (!noteId) {
      setRoomCode(0);
      message.error("Room doesn't exist.");
      return dismiss();
    }
    await loadTeamNote(noteId);
    dismiss();
    nav(`/team/${noteId}`);
  }

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      title="Join a team note"
      destroyTooltipOnHide
      content={
        <DigitInput
          value={roomCode}
          onChange={setRoomCode}
          onSubmit={handleSubmit}
        />
      }
    >
      <Button className="team-btn large" shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
      <Button
        className="team-btn small"
        shape="circle"
        icon={<TeamOutlined />}
      />
    </Popover>
  );
}
