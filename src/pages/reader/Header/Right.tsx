import { FC, useMemo, useState, useEffect, useContext } from "react";
import { Badge, Alert, Modal, Button, Divider, message, Popover } from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate, useParams } from "react-router-dom";
import { PasscodeInput } from "antd-mobile";
import { TeamCtx } from "../Team";
import { getUserID, saveUserName, UserInfo } from "lib/user";
import {
  EyeOutlined,
  MenuOutlined,
  FormOutlined,
  TeamOutlined,
  LinkOutlined,
  CheckOutlined,
  ReloadOutlined,
  CheckCircleFilled,
  DisconnectOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { editNoteData } from "lib/note/archive";
import { UserAvatar } from "component/UserAvatar";
import { putNote } from "lib/network/http";
import copy from "clipboard-copy";
import { useAsideOpen } from "lib/hooks";
import { sortBy } from "lodash";
import IconFont from "component/IconFont";

export const HeaderRight: FC<{
  instantSave: () => Promise<void> | undefined;
}> = ({ instantSave }) => {
  const { teamOn } = useContext(TeamCtx);
  return (
    <div className="right">
      {teamOn ? <RoomInfo /> : <JoinRoom instantSave={instantSave} />}
      <PageNavButton />
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

const RoomInfo: FC = () => {
  const { code, userRec, connected, loadInfo, loadState, resetIO } =
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
      <PasscodeInput
        className="code-display"
        value={String(code)}
        length={4}
        plain
      />
      <ShareButton />
      <Divider />
      <div className="user-list">
        {userList.map((u) => (
          <UserCard key={u.userID} userInfo={u} />
        ))}
      </div>
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

  const showModal = () => {
    Modal.confirm({
      title: "Enable team editing",
      content: "This will make your note public to anyone with the link.",
      icon: <TeamOutlined style={{ color: "#555" }} />,
      onOk: createRoom,
    });
  };

  return (
    <Button type="text" icon={<UsergroupAddOutlined />} onClick={showModal} />
  );
};
