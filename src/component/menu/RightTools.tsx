import { Button, Input, Menu, message, Popover, Progress } from "antd";
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
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {
  TeamOutlined,
  CaretDownOutlined,
  FilePdfOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getNoteId } from "../../lib/network/http";
import DigitInput from "../ui/DigitInput";
import { CSSTransition } from "react-transition-group";
import "./right.sass";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";
import { getUserName, setUserName } from "../../lib/user";

const OthersStateUpdateCtx = createContext({
  setActive: (() => {}) as Dispatch<SetStateAction<string>>,
});

export default function RightTools() {
  return (
    <div id="right-tools">
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
      <Item key="pdf">
        <FilePdfOutlined />
        <span>Load PDF</span>
      </Item>
      <Item key="profile">
        <UserOutlined />
        <span>My profile</span>
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
          onClick={() => setActive("menu")}
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
  const { setAllTags, setAllNotes } = useContext(MenuStateUpdateCtx);
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
  }
  return (
    <SeconaryMenu title="My profile">
      <div className="profile-page">
        <Input
          prefix={<UserOutlined />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleEnter} type="primary" block>Enter</Button>
      </div>
    </SeconaryMenu>
  );
};

const OthersPage = () => {
  const [height, setHeight] = useState(100);
  const [active, setActive] = useState("menu");

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
  return (
    <OthersStateUpdateCtx.Provider value={{ setActive }}>
      <section className="others-menu" style={{ height }}>
        <CSSTransition
          classNames="primary"
          in={active === "menu"}
          {...cssProps}
        >
          <OthersMenu />
        </CSSTransition>
        <CSSTransition in={active === "pdf"} {...cssProps2}>
          <UploadPdfPage />
        </CSSTransition>
        <CSSTransition in={active === "profile"} {...cssProps2}>
          <ProfilePage />
        </CSSTransition>
      </section>
    </OthersStateUpdateCtx.Provider>
  );
};

const OthersButton = () => {
  return (
    <Popover placement="bottomRight" trigger="click" content={<OthersPage />}>
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
    dismiss();
    if (!noteId) {
      setRoomCode(0);
      message.error("Room doesn't exist.");
    } else {
      nav(`/team/${noteId}`);
    }
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
      <Button shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
    </Popover>
  );
}
