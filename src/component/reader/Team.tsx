import { message } from "antd";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { getTeamNoteState, getTeamNoteInfo } from "../../lib/network/http";
import { IoFactory } from "../../lib/network/io";
import Reader, { WIDTH } from "./Reader";
import { getUserId, UserInfo } from "../../lib/user";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { createTeamPage, NotePage, TeamPageInfo } from "../../lib/note/note";

export const TeamCtx = createContext({
  code: -2,
  userList: [] as UserInfo[],
  loadInfo: undefined as undefined | (() => Promise<boolean>),
  teamStateSet: undefined as StateSet | undefined,
  pushOperation: undefined as undefined | ((op: SetOperation) => void),
  teamUpdate: undefined as undefined | TeamUpdate,
  updateReorder: (() => {}) as undefined | ((pageOrder: string[]) => void),
  updateNewPage: (() => {}) as
    | undefined
    | ((pageOrder: string[], pageId: string, newPage: NotePage) => void),
});

type TeamUpdate =
  | {
      type: "reorder";
      pageOrder: string[];
    }
  | {
      type: "newPage";
      pageOrder: string[];
      pageId: string;
      newPage: NotePage;
    };

export default function Team() {
  const noteId = useParams().noteId ?? "";
  const [teamStateSet, setTeamStateSet] = useState<StateSet>();
  const [code, setCode] = useState(-2);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [ws] = useState(IoFactory(noteId));
  const [teamUpdate, setTeamUpdate] = useState<TeamUpdate>();
  const nav = useNavigate();

  async function loadState() {
    const pageRec = await getTeamNoteState(noteId);
    if (!pageRec) {
      message.error("Failed loading the team note state");
      return false;
    }
    setTeamStateSet(StateSet.createFromPages(pageRec, WIDTH));
    return true;
  }

  async function loadInfo() {
    const info = await getTeamNoteInfo(noteId);
    if (!info) {
      message.error("Failed loading the team note info");
      return false;
    }
    setCode(info.code);
    return true;
  }

  const roomInit = async () => {
    if (!((await loadState()) && (await loadInfo()))) {
      return nav("/");
    }
    ws.on("push", ({ operation }) => {
      setTeamStateSet((prev) => prev?.pushOperation(operation));
    });

    ws.on("joined", ({ joined, members }) => {
      const { userId, userName } = joined;
      setUserList(members);
      if (userId === getUserId()) return;
      message.destroy(userId);
      message.success({
        icon: <LoginOutlined />,
        content: `${userName} joined room`,
        key: userId,
        style: { marginTop: 60 },
      });
    });

    ws.on("leaved", ({ leaved, members }) => {
      const { userId, userName } = leaved;
      setUserList(members);
      if (userId === getUserId()) return;
      message.destroy(userId);
      message.warning({
        icon: <LogoutOutlined />,
        content: `${userName} leaved room`,
        key: userId,
        style: { marginTop: 60 },
      });
    });

    ws.on("reorder", ({ pageOrder }: { pageOrder: string[] }) => {
      setTeamUpdate({ type: "reorder", pageOrder });
    });

    ws.on(
      "newPage",
      ({
        pageId,
        newPage,
        pageOrder,
      }: {
        userId: string;
        pageOrder: string[];
        pageId: string;
        newPage: TeamPageInfo;
      }) => {
        const newNotePage = createTeamPage(newPage);
        setTeamUpdate({
          type: "newPage",
          pageOrder,
          pageId,
          newPage: newNotePage,
        });
        setTeamStateSet((prev) => prev?.addState(pageId, newNotePage, WIDTH));
      }
    );

    ws.connect();
  };

  const roomDestroy = () => {
    ws.removeAllListeners();
    ws.disconnect();
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  }, [noteId]);

  const pushOperation = (op: SetOperation) => {
    ws.emit("push", { operation: op });
  };

  const updateReorder = (pageOrder: string[]) => {
    ws.emit("reorder", { pageOrder });
  };

  const updateNewPage = (
    pageOrder: string[],
    pageId: string,
    newPage: NotePage
  ) => {
    setTeamStateSet((prev) => prev?.addState(pageId, newPage, WIDTH));
    const { image, state, marked, ...newTeamPage } = newPage;
    ws.emit("newPage", { pageOrder, pageId, newPage: newTeamPage });
  };

  return (
    <TeamCtx.Provider
      value={{
        code,
        userList,
        teamUpdate,
        teamStateSet,
        loadInfo,
        pushOperation,
        updateReorder,
        updateNewPage,
      }}
    >
      <Reader teamOn />
    </TeamCtx.Provider>
  );
}
