import { useContext, useState, FC, useEffect } from "react";
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
  UserOutlined,
  SyncOutlined,
  ClearOutlined,
  InboxOutlined,
  FilePdfOutlined,
  SettingOutlined,
  CaretDownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import * as serviceWorkerRegistration from "serviceWorkerRegistration";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import { ActiveKeyProvider, useActiveKey } from "lib/hooks";
import { getUserName, saveUserName } from "lib/user";
import { clearImageCache } from "lib/note/imgCache";
import { createNewNote } from "lib/note/archive";
import { CSSTransition } from "react-transition-group";
import localforage from "localforage";
import { MenuCtx } from "../Menu";
import "./others.sass";

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
    const { LoadPDF } = await import("lib/note/pdfImage");
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
    <label>
      <div className="pdf-upload">
        <div className="icon-wrapper">
          {loading ? (
            <Progress width={48} type="circle" percent={percent} />
          ) : (
            <InboxOutlined className="inbox-icon" />
          )}
        </div>
        <p className="hint">Click to upload a pdf file.</p>
      </div>
      <input
        type="file"
        multiple={false}
        accept=".pdf"
        onChange={({ target: { files } }) => {
          const file = files && files[0];
          if (!file) return;
          handleFile(file);
        }}
      />
    </label>
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
  const clearAll = async () => {
    await localforage.clear();
    await clearImageCache();
    window.location.reload();
  };

  const clearServiceWorker = async () => {
    await serviceWorkerRegistration.unregister();
    window.location.reload();
  };

  return (
    <div className="setting-menu">
      <Button icon={<SyncOutlined />} onClick={clearServiceWorker} block>
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

export function OthersMenu() {
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
      <Button className="small" type="text" icon={<CaretDownOutlined />} />
      <Button className="large" shape="circle" icon={<CaretDownOutlined />} />
    </Popover>
  );
}
