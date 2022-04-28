import { message } from "antd";
import React, {
  useState,
  useEffect,
  createContext,
} from "react";
import { getTeamNoteState, loadTeamNoteInfo } from "../../lib/network/http";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { SetOperation } from "../../lib/draw/StateSet";
import { TeamState } from "../../lib/draw/TeamState";
import { getUserID, UserInfo } from "../../lib/user";
import { IoFactory } from "../../lib/network/io";
import { NotePage } from "../../lib/note/note";
import { Set } from "immutable";
import Reader from "./Reader";
import { Setter } from "../../lib/hooks";

export const TeamCtx = createContext({
  code: -2,
  connected: false,
  ignores: Set<string>(),
  userRec: {} as Record<string, UserInfo>,
  teamState: undefined as TeamState | undefined,
  teamUpdate: undefined as undefined | TeamUpdate,
  loadInfo: async () => false,
  pushOperation: (op: SetOperation) => {},
  pushReorder: (pageOrder: string[]) => {},
  pushNewPage: (pageOrder: string[], pageID: string, newPage: NotePage) => {},
  setIgnores: (() => {}) as Setter<Set<string>>,
});

interface ReorderInfo {
  pageOrder: string[];
  deleted: boolean;
  prevOrder: string[];
}

interface NewPageInfo {
  pageOrder: string[];
  pageID: string;
  newPage: NotePage;
}

type TeamUpdate =
  | ({
      type: "reorder";
    } & ReorderInfo)
  | ({
      type: "newPage";
    } & NewPageInfo);

export default function Team() {
  const noteID = useParams().noteID ?? "";
  const [teamState, setTeamState] = useState<TeamState>();
  const [code, setCode] = useState(-2);
  const [userRec, setUserRec] = useState<Record<string, UserInfo>>({});
  const [ignores, setIgnores] = useState(Set<string>());
  const [ws] = useState(IoFactory(noteID));
  const [teamUpdate, setTeamUpdate] = useState<TeamUpdate>();
  const [loaded, setLoaded] = useState(false);
  const [connected, setConnected] = useState(true);
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
      duration: 0,
      key: "TEAM_LOADING",
    });
    if (!((await loadInfo()) && (await loadState()))) {
      message.destroy("TEAM_LOADING");
      return nav("/");
    }
    message.destroy("TEAM_LOADING");
    setLoaded(true);

    ws.on("push", ({ operation, userID }) => {
      setTeamState((prev) => prev?.pushOperation(operation, userID));
    });

    ws.on("joined", ({ joined, members }) => {
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

    ws.on("leaved", ({ leaved, members }) => {
      const { userID, userName } = leaved;
      setUserRec(members);
      if (userID === getUserID()) return;
      message.destroy(userID);
      message.warning({
        content: `${userName} leaved room`,
        icon: <LogoutOutlined />,
        key: userID,
      });
    });

    ws.on("reorder", (info: ReorderInfo) => {
      setTeamUpdate({ type: "reorder", ...info });
    });

    ws.on("newPage", (info: NewPageInfo) => {
      const { pageID, newPage } = info;
      setTeamState((prev) => prev?.addPage(pageID, newPage));
      setTeamUpdate({ type: "newPage", ...info });
    });

    ws.on("reset", ({ userID, pageRec }) => {
      if (userID === getUserID()) return;
      setTeamState((prev) => prev?.resetUser(userID, pageRec));
    });

    ws.on("connect", () => setConnected(true));
    ws.on("disconnect", () => setConnected(false));

    ws.connect();
  };

  const roomDestroy = () => {
    message.destroy("TEAM_LOADING");
    ws.removeAllListeners();
    ws.disconnect();
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  }, [noteID]);

  const pushOperation = (operation: SetOperation) => {
    ws.emit("push", { operation });
  };

  const pushReorder = (pageOrder: string[]) => {
    ws.emit("reorder", { pageOrder });
  };

  const pushNewPage = (
    pageOrder: string[],
    pageID: string,
    newPage: NotePage
  ) => {
    setTeamState((prev) => prev?.addPage(pageID, newPage));
    const { image, marked, ...newTeamPage } = newPage;
    ws.emit("newPage", { pageOrder, pageID, newPage: newTeamPage });
  };

  if (!loaded) return null;
  return (
    <TeamCtx.Provider
      value={{
        code,
        ignores,
        userRec,
        connected,
        teamState,
        teamUpdate,
        loadInfo,
        setIgnores,
        pushReorder,
        pushNewPage,
        pushOperation,
      }}
    >
      <Reader teamOn />
    </TeamCtx.Provider>
  );
}
