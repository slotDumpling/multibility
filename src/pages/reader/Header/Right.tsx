import {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
  ReactNode,
} from "react";
import {
  Badge,
  Alert,
  Modal,
  Button,
  Divider,
  message,
  Popover,
  Tooltip,
  Switch,
  Select,
} from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate, useParams } from "react-router-dom";
import { PasscodeInput } from "antd-mobile";
import { TeamCtx } from "../Team";
import { getUserID, getUserName, saveUserName, UserInfo } from "lib/user";
import {
  EyeOutlined,
  FormOutlined,
  TeamOutlined,
  LinkOutlined,
  UserOutlined,
  CheckOutlined,
  ReloadOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  BranchesOutlined,
  CheckCircleFilled,
  DisconnectOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { editNoteData } from "lib/note/archive";
import { UserAvatar } from "component/UserAvatar";
import { putNote } from "lib/network/http";
import copy from "clipboard-copy";
import { useAsideOpen } from "lib/hooks";
import { sortBy } from "lodash";
import IconFont from "component/IconFont";
import { useDrawCtrl, useUpdateDrawCtrl } from "lib/draw/DrawCtrl";
import { OptionButton } from "../Options";

export const HeaderRight: FC<{
  instantSave: () => Promise<void> | undefined;
}> = ({ instantSave }) => {
  const { teamOn } = useContext(TeamCtx);
  return (
    <div className="right">
      {teamOn ? <RoomInfo /> : <JoinRoom instantSave={instantSave} />}
      <PageNavButton />
      <OptionButton placement="bottomRight" />
    </div>
  );
};

const PageNavButton = () => {
  const [asideOpen, setAsideOpen] = useAsideOpen();
  return (
    <Button
      type={asideOpen ? "link" : "text"}
      icon={<IconFont type="icon-cards" />}
      onClick={() => setAsideOpen((prev) => !prev)}
    />
  );
};

const UserCard: FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
  const [renaming, setRenaming] = useState(false);
  const { ignores, setIgnores, resetIO } = useContext(TeamCtx);
  useEffect(() => setRenaming(false), [userInfo]);
  if (!userInfo) return null;

  const { userName, online, userID } = userInfo;
  const self = userID === getUserID();
  const ignored = ignores.has(userID) && !self;

  const switchIgnore = () => {
    setIgnores((prev) => {
      if (prev.has(userID)) return prev.delete(userID);
      return prev.add(userID);
    });
  };

  const submitRename = (value: string) => {
    const name = value.trim();
    if (!name || name === userName) return setRenaming(false);
    saveUserName(name);
    resetIO();
  };

  return (
    <div className="user-item" data-online={online}>
      <UserAvatar userInfo={userInfo} size="small" className="room-avatar" />
      {renaming || <span className="user-name">{userName}</span>}
      {renaming && (
        <Search
          autoFocus
          className="rename-input"
          defaultValue={userName}
          onSearch={submitRename}
          enterButton={<Button icon={<CheckOutlined />} />}
        />
      )}
      {self ? (
        renaming || (
          <Button
            type="text"
            icon={<FormOutlined />}
            onClick={() => setRenaming(true)}
          />
        )
      ) : (
        <Button
          type="text"
          icon={ignored ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={switchIgnore}
        />
      )}
    </div>
  );
};

const ShareButton: FC = () => {
  const [copied, setCopied] = useState(false);
  const link = window.location.href;
  const share = async () => {
    try {
      await copy(`${document.title}\n${link}`);
      setCopied(true);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button
      icon={copied ? <CheckCircleFilled /> : <LinkOutlined />}
      type={copied ? "primary" : "default"}
      className="share-btn"
      onClick={share}
      block
    >
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
};

const TeamInfoMenu: FC<
  PropsWithChildren<{ title: string; icon: ReactNode }>
> = ({ children, title, icon }) => {
  return (
    <div className="team-info-menu">
      <div className="team-info-title">
        {icon}
        <span>{title}</span>
      </div>
      {children}
      <Divider />
    </div>
  );
};

const ShareMenu: FC = () => {
  const { code } = useContext(TeamCtx);
  return (
    <TeamInfoMenu icon={<ShareAltOutlined />} title="Share">
      <PasscodeInput
        className="code-display"
        value={String(code)}
        length={4}
        plain
      />
      <ShareButton />
    </TeamInfoMenu>
  );
};

const CollaborateMenu: FC = () => {
  const drawCtrl = useDrawCtrl();
  const { globalEraser } = drawCtrl;
  const updateDrawCtrl = useUpdateDrawCtrl();

  return (
    <TeamInfoMenu icon={<BranchesOutlined />} title="Collaborate">
      <div className="global-switch">
        <span>
          Global
          <Tooltip className="hint" title="Turn on to edit others' strokes.">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
        <Switch
          size="small"
          checked={globalEraser}
          onChange={(v) => updateDrawCtrl({ globalEraser: v })}
        />
      </div>
    </TeamInfoMenu>
  );
};

const RoomInfo: FC = () => {
  const { userRec, connected, loadInfo, loadState, resetIO } =
    useContext(TeamCtx);

  const userList = useMemo(() => {
    const selfID = getUserID();
    const { [selfID]: selfInfo, ...otherUsers } = userRec;
    if (!selfInfo) return [];
    const values = Object.values(otherUsers);
    return [selfInfo, ...sortBy(values, "online").reverse()];
  }, [userRec]);

  const onlineNum = useMemo(
    () => userList.filter(({ online }) => online).length,
    [userList]
  );

  const teamPop = (
    <div className="team-popover">
      {connected || (
        <Alert
          className="disconn-alert"
          message="Network failed."
          icon={<DisconnectOutlined />}
          type="error"
          showIcon
          banner
        />
      )}
      <ShareMenu />
      <CollaborateMenu />
      <TeamInfoMenu icon={<TeamOutlined />} title="Members">
        <div className="user-list">
          {userList.map((u) => (
            <UserCard key={u.userID} userInfo={u} />
          ))}
        </div>
      </TeamInfoMenu>
    </div>
  );

  const [reloading, setReloading] = useState(false);
  const title = (
    <div className="team-title">
      <span>Team info</span>
      <Button
        shape="circle"
        type="text"
        size="small"
        loading={reloading}
        icon={<ReloadOutlined />}
        onClick={async () => {
          setReloading(true);
          await loadInfo();
          await loadState();
          setReloading(false);
          resetIO();
        }}
      />
    </div>
  );

  return (
    <Popover
      content={teamPop}
      trigger="click"
      placement="bottomRight"
      title={title}
      getPopupContainer={(e) => e.parentElement!}
      destroyTooltipOnHide
    >
      <Button
        type="text"
        icon={
          <Badge
            status={connected ? "success" : "error"}
            count={connected ? onlineNum : "!"}
            size="small"
          >
            <TeamOutlined />
          </Badge>
        }
      />
    </Popover>
  );
};

const JoinRoom: FC<{
  instantSave: () => Promise<void> | undefined;
}> = ({ instantSave }) => {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const createRoom = async () => {
    await instantSave();
    const res = await putNote(noteID);
    if (!res) return message.error("Can't create room.");
    await editNoteData(noteID, { team: true });
    nav("/team/" + noteID);
  };

  const content = (
    <div className="share-modal-content">
      <Alert
        className="share-alert"
        type="warning"
        message="This will make your note public."
      />
      <p className="share-list-item">
        <span className="user-info">
          <GlobalOutlined />
          Anyone with the link
        </span>
        <Select
          defaultValue="EDIT"
          options={[{ value: "EDIT", label: "Edit" }]}
        />
      </p>
      <p className="share-list-item">
        <span className="user-info">
          <UserOutlined />
          {getUserName()} (You)
        </span>
        <span>Owner</span>
      </p>
    </div>
  );

  const showModal = () => {
    Modal.confirm({
      title: "Enable team editing",
      content,
      icon: <TeamOutlined style={{ color: "#555" }} />,
      onOk: createRoom,
    });
  };

  return (
    <Button type="text" icon={<UsergroupAddOutlined />} onClick={showModal} />
  );
};
