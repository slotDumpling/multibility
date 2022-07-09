import { useContext, useState } from "react";
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
import * as serviceWorkerRegistration from "../../../serviceWorkerRegistration";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import { getUserName, saveUserName } from "../../../lib/user";
import { clearImageCache } from "../../../lib/note/imgCache";
import { createNewNote } from "../../../lib/note/archive";
import { CSSTransition } from "react-transition-group";
import { getNoteID } from "../../../lib/network/http";
import { useNavigate } from "react-router-dom";
import Dragger from "antd/lib/upload/Dragger";
import { PasscodeInput } from "antd-mobile";
import localforage from "localforage";
import { MenuCtx } from "../MainMenu";
import { useEffect } from "react";
import { FC } from "react";
import "./right.sass";
import { ActiveKeyProvider, useActiveKey } from "../../../lib/hooks";

export default function Right() {
  return (
    <div className="right-tools">
      <JoinTeamButton />
      <OthersButton />
    </div>
  );
}

const SeconaryMenu: FC<
  {
    title: string;
    keyName: string;
  } & CSSTransitionProps
> = ({ children, title, keyName, ...cssTransProps }) => {
  const [active, setActive] = useActiveKey();
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

const UploadPdfPage = () => {
  const [loading, setLoading] = useState(false);
  const { currTagID, setAllTags, setAllNotes } = useContext(MenuCtx);
  const [percent, setPercent] = useState(0);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") return;
    setLoading(true);
    const { LoadPDF } = await import("../../../lib/note/pdfImage");
    const note = await LoadPDF(file, setPercent);
    note.tagID = currTagID;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
    setLoading(false);
    message.success("PDF Loaded");
    return false;
  }

  return (
    <Dragger
      className="pdf-upload"
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
};

const ProfilePage = () => {
  const [, setActive] = useActiveKey();
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
  const { menuInit } = useContext(MenuCtx);

  const clearAll = async () => {
    await localforage.clear();
    await clearImageCache();
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

const menuItems = [
  {
    key: "PDF",
    label: "Import PDF",
    component: <UploadPdfPage />,
    icon: <FilePdfOutlined />,
  },
  {
    key: "PROFILE",
    label: "My profile",
    component: <ProfilePage />,
    icon: <UserOutlined />,
  },
  {
    key: "SETTINGS",
    label: "Settings",
    component: <SettingsPage />,
    icon: <SettingOutlined />,
  },
];

const PrimaryMenu = () => {
  const [, setActive] = useActiveKey();
  return (
    <div className="primary-menu">
      <Menu onClick={({ key }) => setActive(key)} items={menuItems} />
    </div>
  );
};

const OthersPage = () => {
  const [height, setHeight] = useState(0);
  const [active, setActive] = useActiveKey();

  const calcHeight = (el: HTMLElement) => {
    setHeight(el.clientHeight);
  };

  const cssTransProps = {
    timeout: 300,
    onEnter: calcHeight,
    unmountOnExit: true,
  };

  useEffect(() => setActive("MENU"), [setActive]);

  return (
    <section className="others-menu" style={{ height }}>
      <CSSTransition in={active === "MENU"} {...cssTransProps}>
        <PrimaryMenu />
      </CSSTransition>
      {menuItems.map(({ key, label, component }) => (
        <SeconaryMenu key={key} keyName={key} title={label} {...cssTransProps}>
          {component}
        </SeconaryMenu>
      ))}
    </section>
  );
};

const OthersButton = () => {
  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={
        <ActiveKeyProvider initKey="">
          <OthersPage />
        </ActiveKeyProvider>
      }
      zIndex={900}
    >
      <Button className="large" shape="circle" icon={<CaretDownOutlined />} />
      <Button className="small" type="text" icon={<CaretDownOutlined />} />
    </Popover>
  );
};

const JoinTeamButton = () => {
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
};
