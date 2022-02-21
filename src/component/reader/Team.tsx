import { message } from "antd";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { getTeamNote } from "../../lib/network/http";
import { IoFactory } from "../../lib/network/io";
import Reader, { WIDTH } from "./Reader";
import { getUserId, UserInfo } from "../../lib/user";
import {
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export const TeamStateCtx = createContext({
  code: -2,
  userList: [] as UserInfo[],
});

export default function Team() {
  const noteId = useParams().noteId ?? "";
  const [teamStateSet, setTeamStateSet] = useState<StateSet>();
  const [code, setCode] = useState(-2);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [ws] = useState(IoFactory(noteId));
  const nav = useNavigate();

  async function loadTeamPages() {
    const res = await getTeamNote(noteId);
    if (!res) {
      message.error("Failed loading the team note");
      return nav("/");
    }
    const { code, pages } = res;
    setCode(code);
    setTeamStateSet(StateSet.createFromPages(pages, WIDTH));
  }

  const roomInit = async () => {
    await loadTeamPages();
    ws.on("push", ({ operation }) => {
      setTeamStateSet((prev) => prev?.pushOperation(operation));
    });

    ws.on("joined", ({ joined, members }) => {
      const { userId, userName } = joined;
      setUserList(members);
      if (userId === getUserId()) return;
      message.success({
        icon: <LoginOutlined />,
        content: userName + " joined room",
      });
    });

    ws.on("leaved", ({ leaved, members }) => {
      const { userId, userName } = leaved;
      setUserList(members);
      if (userId === getUserId()) return;
      message.warning({
        icon: <LogoutOutlined />,
        content: userName + " leaved room",
      });
    });

    ws.connect();
  };

  const roomDestroy = () => {
    ws.off("connect");
    ws.off("push");
    ws.off("joined");
    ws.off("leaved");
    ws.disconnect();
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  }, [noteId]);

  const pushOperation = (op: SetOperation) => {
    ws.emit("push", { operation: op });
  };

  return (
    <TeamStateCtx.Provider value={{ code, userList }}>
      <Reader
        teamOn={true}
        teamStateSet={teamStateSet}
        pushOperation={pushOperation}
      />
    </TeamStateCtx.Provider>
  );
}
