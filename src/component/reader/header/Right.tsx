import { FC, useMemo, useState, useEffect, useContext } from "react";
import { Badge, Alert, Modal, Button, Divider, message, Popover } from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { PasscodeInput } from "antd-mobile";
import { ReaderStateCtx } from "../Reader";
import { TeamCtx } from "../Team";
import { getUserID, saveUserName } from "lib/user";
import { PageNav } from "../PageNav";
import {
  EyeOutlined,
  FormOutlined,
  TeamOutlined,
  CopyOutlined,
  CheckOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  DisconnectOutlined,
  EyeInvisibleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { editNoteData } from "lib/note/archive";
import { UserAvatar } from "component/widgets/UserAvatar";
import { putNote } from "lib/network/http";
import copy from "clipboard-copy";

export const HeaderRight: FC<{
  instantSave: () => Promise<void> | undefined;
}> = ({ instantSave }) => {
  const { teamOn } = useContext(TeamCtx);
  return (
    <div className="right">
      {teamOn ? <RoomInfo /> : <JoinRoom instantSave={instantSave} />}
      <PageNav />
    </div>
  );
};

const UserCard: FC<{ userID: string }> = ({ userID }) => {
  const [renaming, setRenaming] = useState(false);
  const { ignores, setIgnores, resetIO, userRec } = useContext(TeamCtx);
  const userInfo = userRec[userID];
  useEffect(() => setRenaming(false), [userInfo]);
  if (!userInfo) return null;

  const { userName, online } = userInfo;
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

const RoomInfo: FC = () => {
  const { code, userRec, connected, loadInfo, loadState, resetIO } =
    useContext(TeamCtx);
  const { noteInfo } = useContext(ReaderStateCtx);
  const link = window.location.href;
  const share = async () => {
    const selfName = userRec[getUserID()]?.userName;
    try {
      if (!noteInfo) return;
      await copy(`${noteInfo.name} - ${selfName} - Multibility\n${link}`);
      message.destroy("copy");
      message.success({
        content: "Link copied!",
        icon: <CopyOutlined />,
        key: "copy",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const userList = useMemo(() => {
    const selfID = getUserID();
    const { [selfID]: selfInfo, ...otherUsers } = userRec;
    const list = selfInfo ? [selfInfo] : [];
    const values = Object.values(otherUsers);
    list.push(
      ...values.filter(({ online }) => online),
      ...values.filter(({ online }) => !online)
    );
    return list;
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
      <Button
        icon={<ShareAltOutlined />}
        className="share-btn"
        onClick={share}
        block
      >
        Share
      </Button>
      <Divider />
      <div className="user-list">
        {userList.map((u) => (
          <UserCard key={u.userID} userID={u.userID} />
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
  const { noteID } = useContext(ReaderStateCtx);
  const nav = useNavigate();

  const createRoom = async () => {
    await instantSave();
    const res = await putNote(noteID);
    if (!res) return message.error("Can't create room.");
    await editNoteData(noteID, { team: true });
    nav("/team/" + noteID);
  };

  return (
    <Button
      type="text"
      icon={<UsergroupAddOutlined />}
      onClick={() => {
        Modal.confirm({
          title: "Enable team editing",
          content: "This will make your note public to anyone with the link.",
          icon: <TeamOutlined style={{ color: "#555" }} />,
          onOk: createRoom,
        });
      }}
    />
  );
};
