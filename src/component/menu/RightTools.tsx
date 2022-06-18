import {
  Menu,
  Input,
  Button,
  message,
  Popover,
  Progress,
  Popconfirm,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  SyncOutlined,
  ClearOutlined,
  InboxOutlined,
  FilePdfOutlined,
  SettingOutlined,
  CaretDownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import * as serviceWorkerRegistration from "../.././serviceWorkerRegistration";
import { createContext, useContext, useState } from "react";
import { getUserName, saveUserName } from "../../lib/user";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import { createNewNote } from "../../lib/note/archive";
import { CSSTransition } from "react-transition-group";
import { getNoteID } from "../../lib/network/http";
import { useNavigate } from "react-router-dom";
import Dragger from "antd/lib/upload/Dragger";
import { PasscodeInput } from "antd-mobile";
import { Setter } from "../../lib/hooks";
import localforage from "localforage";
import { useEffect } from "react";
import { FC } from "react";
import "./rightTools.sass";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

const activeKeyCtx = createContext({
  active: "MENU",
  setActive: (() => {}) as Setter<string>,
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
  const { setActive } = useContext(activeKeyCtx);
  return (
    <div className="other-menu">
      <Menu
        onClick={({ key }) => setActive(key)}
        items={[
          { key: "PDF", icon: <FilePdfOutlined />, label: "Import PDF" },
          { key: "PROFILE", icon: <UserOutlined />, label: "My profile" },
          { key: "SETTINGS", icon: <SettingOutlined />, label: "Settings" },
        ]}
      />
    </div>
  );
};

const SeconaryMenu: FC<{
  title: string;
  cssTransProps: CSSTransitionProps;
  keyName: string;
}> = ({ children, title, cssTransProps, keyName }) => {
  const { active, setActive } = useContext(activeKeyCtx);
  return (
    <CSSTransition in={active === keyName} {...cssTransProps}>
      <div className="secondary">
        <nav>
          <Button
            type="text"
            shape="circle"
            onClick={() => setActive("MENU")}
            icon={<ArrowLeftOutlined />}
          />
          <h3>{title}</h3>
        </nav>
        {children}
      </div>
    </CSSTransition>
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
    const { LoadPDF } = await import("../../lib/note/pdfImage");
    const note = await LoadPDF(file, setPercent);
    note.tagID = tagUid;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
    setLoading(false);
    message.success("PDF Loaded");
    return false;
  }

  return (
    <Dragger
      disabled={loading}
      multiple={false}
      action="#"
      accept="application/pdf"
      beforeUpload={handleFile}
    >
      <p className="ant-upload-drag-icon">
        {loading && <Progress width={48} type="circle" percent={percent} />}
        {loading || <InboxOutlined />}
      </p>
      <p className="ant-upload-hint">Click or drag a pdf file here.</p>
    </Dragger>
  );
}

const ProfilePage = () => {
  const { setActive } = useContext(activeKeyCtx);
  const userName = getUserName();
  const [name, setName] = useState(userName);
  const handleEnter = () => {
    if (!name) return;
    saveUserName(name);
    setActive("MENU");
  };
  return (
    <div className="profile-page">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        prefix={<UserOutlined />}
        allowClear
      />
      <Button
        disabled={userName === name || !name}
        onClick={handleEnter}
        type="primary"
        block
      >
        OK
      </Button>
    </div>
  );
};

const SettingsPage = () => {
  const { menuInit } = useContext(MenuMethodCtx);

  const clearAll = async () => {
    await localforage.clear();
    menuInit();
  };

  return (
    <div className="setting-menu">
      <Button
        icon={<SyncOutlined />}
        onClick={async () => {
          await serviceWorkerRegistration.unregister();
          window.location.reload();
        }}
        block
      >
        Update
      </Button>
      <Popconfirm
        title="Everything will be deleted."
        onConfirm={clearAll}
        icon={<ClearOutlined />}
        okText="Delete"
        okType="danger"
        okButtonProps={{ type: "primary" }}
        cancelText="Cancel"
        placement="bottom"
      >
        <Button icon={<ClearOutlined />} danger block>
          Clear all
        </Button>
      </Popconfirm>
    </div>
  );
};

const OthersPage = () => {
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState("");

  const calcHeight = (el: HTMLElement) => {
    setHeight(el.clientHeight);
  };

  const primeProps = {
    classNames: "primary",
    timeout: 300,
    onEnter: calcHeight,
    unmountOnExit: true,
  };

  const secdProps = { ...primeProps, classNames: "secondary" };

  useEffect(() => setActive("MENU"), []);

  const subMenus = [
    { key: "PDF", title: "Import PDF", component: <UploadPdfPage /> },
    { key: "PROFILE", title: "My profile", component: <ProfilePage /> },
    { key: "SETTINGS", title: "Settings", component: <SettingsPage /> },
  ];

  return (
    <activeKeyCtx.Provider value={{ active, setActive }}>
      <section className="others-menu" style={{ height }}>
        <CSSTransition in={active === "MENU"} {...primeProps}>
          <OthersMenu />
        </CSSTransition>
        {subMenus.map(({ key, title, component }) => (
          <SeconaryMenu
            key={key}
            keyName={key}
            title={title}
            cssTransProps={secdProps}
          >
            {component}
          </SeconaryMenu>
        ))}
      </section>
    </activeKeyCtx.Provider>
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
      <Button className="large" shape="circle" icon={<CaretDownOutlined />} />
      <Button className="small" type="text" icon={<CaretDownOutlined />} />
    </Popover>
  );
};

function JoinTeamButton() {
  const [roomCode, setRoomCode] = useState("");
  const [wrong, setWrong] = useState(false);

  const nav = useNavigate();
  async function handleSubmit(code: string) {
    const noteID = await getNoteID(code);
    if (noteID) return nav(`/team/${noteID}`);
    setRoomCode("");
    setWrong(true);
  }

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      title="Join a team note"
      destroyTooltipOnHide
      onVisibleChange={() => setWrong(false)}
      content={
        <PasscodeInput
          plain
          length={4}
          error={wrong}
          value={roomCode}
          onChange={(v) => {
            setWrong(false);
            setRoomCode(v);
          }}
          onFill={handleSubmit}
        />
      }
    >
      <Button className="team-btn large" shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
      <Button className="team-btn small" type="text" icon={<TeamOutlined />} />
    </Popover>
  );
}
