import { message } from "antd";
import React, { useState, useEffect, createContext } from "react";
import { getTeamNoteState, loadTeamNoteInfo } from "../../lib/network/http";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { IoFactory, NewPageInfo } from "../../lib/network/io";
import { useNavigate, useParams } from "react-router-dom";
import { TeamState } from "../../lib/draw/TeamState";
import { getUserID, UserInfo } from "../../lib/user";
import { NotePage } from "../../lib/note/note";
import { Socket } from "socket.io-client";
import { Setter } from "../../lib/hooks";
import { Set } from "immutable";
import Reader from "./Reader";

export const TeamCtx = createContext({
  io: undefined as Socket | undefined,
  code: -2,
  connected: false,
  ignores: Set<string>(),
  userRec: {} as Record<string, UserInfo>,
  teamState: undefined as TeamState | undefined,
  resetIO: () => {},
  loadInfo: async () => false,
  setIgnores: (() => {}) as Setter<Set<string>>,
  addTeamStatePage: (pageID: string, newPage: NotePage) => {},
});

export default function Team() {
  const noteID = useParams().noteID ?? "";
  const [teamState, setTeamState] = useState<TeamState>();
  const [code, setCode] = useState(-2);
  const [userRec, setUserRec] = useState<Record<string, UserInfo>>({});
  const [ignores, setIgnores] = useState(Set<string>());
  const [io, setIO] = useState(IoFactory(noteID));
  const [loaded, setLoaded] = useState(false);
  const [connected, setConnected] = useState(false);
  const nav = useNavigate();

  const loadState = async () => {
    const teamNote = await getTeamNoteState(noteID);
    if (!teamNote) {
      message.error("Failed loading the team note state");
      return false;
    }
    setTeamState(TeamState.createFromTeamPages(teamNote));
    return true;
  };

  const loadInfo = async () => {
    const info = await loadTeamNoteInfo(noteID);
    if (!info) {
      message.error("Failed loading the team note info");
      return false;
    }
    setCode(info.code);
    return true;
  };

  const roomInit = async () => {
    message.loading({
      content: "Loading team note...",
      key: "TEAM_LOADING",
      duration: 0,
    });
    if (!((await loadInfo()) && (await loadState()))) {
      message.destroy("TEAM_LOADING");
      return nav("/");
    }
    message.destroy("TEAM_LOADING");
    setLoaded(true);
  };

  useEffect(() => {
    io.on("push", ({ operation, userID }) => {
      setTeamState((prev) => prev?.pushOperation(operation, userID));
    });

    io.on("join", ({ joined, members }) => {
      const { userID, userName } = joined;
      setUserRec(members);
      if (userID === getUserID()) return;
      message.destroy(userID);
      message.success({
        content: `${userName} joined room`,
        icon: <LoginOutlined />,
        key: userID,
      });
    });

    io.on("leave", ({ leaved, members }) => {
      const { userID, userName } = leaved;
      setUserRec(members);
      if (userID === getUserID()) return io.emit("join");
      message.destroy(userID);
      message.warning({
        content: `${userName} leaved room`,
        icon: <LogoutOutlined />,
        key: userID,
      });
    });

    io.on("newPage", (info: NewPageInfo) => {
      const { pageID, newPage } = info;
      setTeamState((prev) => prev?.addPage(pageID, newPage));
    });

    io.on("reset", ({ userID, pageRec }) => {
      if (userID === getUserID()) return;
      setTeamState((prev) => prev?.resetUser(userID, pageRec));
    });

    io.on("connect_error", console.error);
    io.on("connect", () => setConnected(true));
    io.on("disconnect", () => setConnected(false));

    return () => {
      io.removeAllListeners();
      io.close();
    };
  }, [io]);

  const roomDestroy = () => {
    message.destroy("TEAM_LOADING");
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteID]);

  const addTeamStatePage = (pageID: string, newPage: NotePage) => {
    setTeamState((prev) => prev?.addPage(pageID, newPage));
  };

  const resetIO = () => setIO(IoFactory(noteID));

  if (!loaded) return null;
  return (
    <TeamCtx.Provider
      value={{
        io,
        code,
        ignores,
        userRec,
        connected,
        teamState,
        resetIO,
        loadInfo,
        setIgnores,
        addTeamStatePage,
      }}
    >
      <Reader teamOn />
    </TeamCtx.Provider>
  );
}
