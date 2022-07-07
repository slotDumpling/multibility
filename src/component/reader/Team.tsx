import React, { useState, useEffect, useCallback } from "react";
import {
  getTeamNoteState,
  loadTeamNoteInfo,
  updatePages,
} from "../../lib/network/http";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { IoFactory, NewPageInfo } from "../../lib/network/io";
import { useNavigate, useParams } from "react-router-dom";
import { TeamState } from "../../lib/draw/TeamState";
import { getUserID, UserInfo } from "../../lib/user";
import { NotePage } from "../../lib/note/note";
import { Socket } from "socket.io-client";
import { Setter } from "../../lib/hooks";
import { Loading } from "../ui/Loading";
import { message } from "antd";
import { Set } from "immutable";
import Reader from "./Reader";

export const TeamCtx = React.createContext({
  io: undefined as Socket | undefined,
  code: 0,
  teamOn: false,
  connected: false,
  ignores: Set<string>(),
  userRec: {} as Record<string, UserInfo>,
  teamState: undefined as TeamState | undefined,
  resetIO: () => {},
  loadInfo: async () => false,
  loadState: async () => false,
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

  const loadInfo = useCallback(async () => {
    const info = await loadTeamNoteInfo(noteID);
    if (!info) {
      message.error("Failed loading the team note info");
      return false;
    }
    setCode(info.code);
    return true;
  }, [noteID]);

  const loadState = useCallback(async () => {
    const teamNote = await getTeamNoteState(noteID);
    if (!teamNote) {
      message.error("Failed loading the team note state");
      return false;
    }
    setTeamState(TeamState.createFromTeamPages(teamNote));
    return true;
  }, [noteID]);

  const updateSelfState = useCallback(() => {
    updatePages(noteID);
  }, [noteID]);

  useEffect(() => {
    const roomInit = async () => {
      const infoLoaded = await loadInfo();
      const stateLoaded = await loadState();
      if (!infoLoaded || !stateLoaded) return nav("/");
      setLoaded(true);
      updateSelfState();
    };
    roomInit();
    return updateSelfState;
  }, [loadInfo, loadState, nav, updateSelfState]);

  useEffect(() => {
    io.on("push", ({ operation, userID }) => {
      setTeamState((prev) => prev?.pushOperation(operation, userID));
    });

    io.on("join", ({ joined, members }) => {
      const { userID, userName } = joined;
      setUserRec(members);
      if (userID === getUserID()) return;
      showJoinMsg(userID, userName);
    });

    io.on("leave", ({ leaved, members }) => {
      const { userID, userName } = leaved;
      setUserRec(members);
      if (userID === getUserID()) return io.emit("join");
      showLeaveMsg(userID, userName);
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

  const addTeamStatePage = (pageID: string, newPage: NotePage) => {
    setTeamState((prev) => prev?.addPage(pageID, newPage));
  };

  const resetIO = () => setIO(IoFactory(noteID));

  return (
    <Loading loading={!loaded}>
      <TeamCtx.Provider
        value={{
          io,
          code,
          teamOn: true,
          ignores,
          userRec,
          connected,
          teamState,
          resetIO,
          loadInfo,
          loadState,
          setIgnores,
          addTeamStatePage,
        }}
      >
        <Reader />
      </TeamCtx.Provider>
    </Loading>
  );
}

const showJoinMsg = (userID: string, userName: string) => {
  message.destroy(userID);
  message.success({
    content: `${userName} joined room`,
    icon: <LoginOutlined />,
    key: userID,
  });
};

const showLeaveMsg = (userID: string, userName: string) => {
  message.destroy(userID);
  message.warning({
    content: `${userName} leaved room`,
    icon: <LogoutOutlined />,
    key: userID,
  });
};
