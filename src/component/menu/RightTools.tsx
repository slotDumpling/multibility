import {
  Button,
  ButtonProps,
  Input,
  Menu,
  message,
  Popconfirm,
  Popover,
  Progress,
} from "antd";
import { createContext, ReactNode, useContext, useState } from "react";
import { createNewNote } from "../../lib/note/archive";
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
import { getUserName, saveUserName } from "../../lib/user";
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

const OthersCtx = createContext({
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
  const { setActive } = useContext(OthersCtx);
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
  children: ReactNode;
  title: string;
}> = ({ children, title }) => {
  const { setActive } = useContext(OthersCtx);
  return (
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
    <SeconaryMenu title="Import PDF">
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
  const { setActive } = useContext(OthersCtx);
  const handleEnter = () => {
    if (!name) return;
    saveUserName(name);
    setActive("MENU");
  };
  return (
    <SeconaryMenu title="My profile">
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
    </SeconaryMenu>
  );
};

const SettingsPage = () => {
  const { menuInit } = useContext(MenuMethodCtx);

  const clearAll = async () => {
    await localforage.clear();
    menuInit();
  };

  return (
    <SeconaryMenu title="Settings">
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
    <OthersCtx.Provider value={{ setActive }}>
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
    </OthersCtx.Provider>
  );
};

const OthersButton = () => {
  const btnProps: ButtonProps = {
    shape: "circle",
    icon: <CaretDownOutlined />,
  };
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={<OthersPage />}
      zIndex={900}
    >
      <Button className="large" {...btnProps} />
      <Button className="small" type="text" {...btnProps} />
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
      <Button
        className="team-btn small"
        type="text"
        shape="circle"
        icon={<TeamOutlined />}
      />
    </Popover>
  );
}
