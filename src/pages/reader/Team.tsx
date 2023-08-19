import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getTeamNoteState,
  loadTeamNoteInfo,
  updatePages,
} from "lib/network/http";
import { IoFactory, NewPageInfo } from "lib/network/io";
import { useNavigate, useParams } from "react-router-dom";
import { showJoinMsg, showLeaveMsg } from "./tools/Messages";
import { TeamState } from "lib/draw/TeamState";
import { getUserID, UserInfo } from "lib/user";
import { NotePage } from "lib/note/note";
import { Socket } from "socket.io-client";
import { Setter, useEvent } from "lib/hooks";
import { Loading } from "component/Loading";
import { message } from "antd";
import { Set } from "immutable";
import Reader from "./Reader";
import { DebouncedFunc, throttle } from "lodash";
import bytes from "bytes";

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
  loadState: (() => {}) as DebouncedFunc<() => Promise<boolean>>,
  setIgnores: (() => {}) as Setter<Set<string>>,
  addTeamStatePage: (pageID: string, newPage: NotePage) => {},
  checkOpID: (prevID: string, currID: string) => {},
});

export default function Team() {
  const noteID = useParams().noteID ?? "";
  const [teamState, setTeamState] = useState<TeamState>();
  const [code, setCode] = useState(-2);
  const [userRec, setUserRec] = useState<Record<string, UserInfo>>({});
  const [ignores, setIgnores] = useState(Set<string>());
  const [io, setIO] = useState<Socket>();
  const [loaded, setLoaded] = useState(false);
  const [connected, setConnected] = useState(false);
  const nav = useNavigate();
  const [loadingText, setLoadingText] = useState("");

  const loadInfo = useEvent(async () => {
    setLoadingText("Loading note info...");
    const info = await loadTeamNoteInfo(noteID, (len) => {
      setLoadingText("Downloading PDF: " + bytes(len));
    });
    if (!info) {
      message.error("Failed loading the team note info");
      return false;
    }
    setCode(info.code);
    return true;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadState = useCallback(
    throttle(async (cb?: (len: number) => void) => {
      setLoadingText("Loading team note...");
      const teamNote = await getTeamNoteState(noteID, (len) => {
        if (len < 1024) return;
        setLoadingText("Loading team note: " + bytes(len));
        cb?.(len);
      });
      if (!teamNote) {
        message.error("Failed loading the team note state");
        return false;
      }
      setTeamState(TeamState.createFromTeamPages(teamNote));
      return true;
    }, 10_000),
    [noteID]
  );
  const reloadState = () => {
    const key = "SYNC";
    const hide = message.loading({ content: "Syncing...", key });
    loadState((len) => {
      const content = "Syncing: " + bytes(len);
      message.loading({ content, key, duration: 0 });
    })?.then(hide);
  };

  const resetIO = useEvent(() => setIO(IoFactory(noteID)));
  const updateSelfState = useEvent(() => void updatePages(noteID));

  const opID = useRef("");
  const checkOpID = useEvent((prevID: string, currID: string) => {
    const lost = prevID && opID.current && prevID !== opID.current;
    opID.current = currID;
    if (lost) reloadState();
  });
  const resetOpID = useEvent((currID: string) => {
    const lost = opID.current && opID.current !== currID;
    opID.current = currID;
    if (lost) reloadState();
  });

  useEffect(() => {
    const roomInit = async () => {
      const infoLoaded = await loadInfo();
      const stateLoaded = await loadState();
      if (!infoLoaded || !stateLoaded) return nav("/");
      setLoaded(true);
      resetIO();
      updateSelfState();
    };
    roomInit();
    return updateSelfState;
  }, [loadInfo, loadState, nav, resetIO, updateSelfState]);

  useEffect(() => {
    if (!io) return;
    io.on("push", ({ operation, userID, prevID, currID }) => {
      setTeamState((prev) => prev?.pushOperation(operation, userID));
      checkOpID(prevID, currID);
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
    io.on("disconnect", () => setConnected(false));
    io.on("connect", () => setConnected(true));
    io.on("connected", ({ currID }) => resetOpID(currID));

    return () => {
      io.removeAllListeners();
      io.close();
    };
  }, [io, checkOpID, resetOpID]);

  const addTeamStatePage = (pageID: string, newPage: NotePage) => {
    setTeamState((prev) => prev?.addPage(pageID, newPage));
  };

  return (
    <Loading loading={!loaded} text={loadingText}>
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
          checkOpID,
        }}
      >
        <Reader />
      </TeamCtx.Provider>
    </Loading>
  );
}
