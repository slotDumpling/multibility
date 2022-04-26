import { message } from "antd";
import React, {
  useState,
  Dispatch,
  useEffect,
  createContext,
  SetStateAction,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SetOperation } from "../../lib/draw/StateSet";
import { getTeamNoteState, loadTeamNoteInfo } from "../../lib/network/http";
import { IoFactory } from "../../lib/network/io";
import Reader from "./Reader";
import { getUserID, UserInfo } from "../../lib/user";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { NotePage } from "../../lib/note/note";
import { TeamState } from "../../lib/draw/TeamState";
import { Set } from "immutable";

export const TeamCtx = createContext({
  code: -2,
  userRec: {} as Record<string, UserInfo>,
  ignores: Set<string>(),
  setIgnores: (() => {}) as Dispatch<SetStateAction<Set<string>>>,
  loadInfo: (() => {}) as () => Promise<boolean>,
  teamState: undefined as TeamState | undefined,
  pushOperation: (() => {}) as (op: SetOperation) => void,
  teamUpdate: undefined as undefined | TeamUpdate,
  pushReorder: (() => {}) as (pageOrder: string[]) => void,
  pushNewPage: (() => {}) as (
    pageOrder: string[],
    pageID: string,
    newPage: NotePage
  ) => void,
  connected: false,
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
        icon: <LoginOutlined />,
        content: `${userName} joined room`,
        key: userID,
      });
    });

    ws.on("leaved", ({ leaved, members }) => {
      const { userID, userName } = leaved;
      setUserRec(members);
      if (userID === getUserID()) return;
      message.destroy(userID);
      message.warning({
        icon: <LogoutOutlined />,
        content: `${userName} leaved room`,
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
    ws.removeAllListeners();
    ws.disconnect();
    message.destroy("TEAM_LOADING");
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
        loadInfo,
        connected,
        teamState,
        setIgnores,
        teamUpdate,
        pushOperation,
        pushReorder,
        pushNewPage,
      }}
    >
      <Reader teamOn />
    </TeamCtx.Provider>
  );
}
