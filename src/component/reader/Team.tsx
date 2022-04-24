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
import Reader, { WIDTH } from "./Reader";
import { getuserID, UserInfo } from "../../lib/user";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { createTeamPage, NotePage } from "../../lib/note/note";
import { TeamState } from "../../lib/draw/TeamState";
import { Set } from "immutable";

export const TeamCtx = createContext({
  code: -2,
  userList: [] as UserInfo[],
  ignores: Set<string>(),
  setIgnores: (() => {}) as Dispatch<SetStateAction<Set<string>>>,
  loadInfo: undefined as undefined | (() => Promise<boolean>),
  teamStateSet: undefined as TeamState | undefined,
  pushOperation: undefined as undefined | ((op: SetOperation) => void),
  teamUpdate: undefined as undefined | TeamUpdate,
  updateReorder: (() => {}) as undefined | ((pageOrder: string[]) => void),
  updateNewPage: (() => {}) as
    | undefined
    | ((pageOrder: string[], pageID: string, newPage: NotePage) => void),
  connected: false,
});

type TeamUpdate =
  | {
      type: "reorder";
      pageOrder: string[];
    }
  | {
      type: "newPage";
      pageOrder: string[];
      pageID: string;
      newPage: NotePage;
    };

export default function Team() {
  const noteID = useParams().noteID ?? "";
  const [teamStateSet, setTeamStateSet] = useState<TeamState>();
  const [code, setCode] = useState(-2);
  const [userList, setUserList] = useState<UserInfo[]>([]);
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
    setTeamStateSet(TeamState.createFromTeamPages(teamNote, WIDTH));
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
    const dismiss = message.loading("Loading team note...", 0);
    if (!((await loadInfo()) && (await loadState()))) {
      dismiss();
      return nav("/");
    }
    dismiss();
    setLoaded(true);
    ws.on("push", ({ operation, userID }) => {
      setTeamStateSet((prev) => prev?.pushOperation(operation, userID, WIDTH));
    });

    ws.on("joined", ({ joined, members }) => {
      const { userID, userName } = joined;
      setUserList(members);
      if (userID === getuserID()) return;
      message.destroy(userID);
      message.success({
        icon: <LoginOutlined />,
        content: `${userName} joined room`,
        key: userID,
      });
    });

    ws.on("leaved", ({ leaved, members }) => {
      const { userID, userName } = leaved;
      setUserList(members);
      if (userID === getuserID()) return;
      message.destroy(userID);
      message.warning({
        icon: <LogoutOutlined />,
        content: `${userName} leaved room`,
        key: userID,
      });
    });

    ws.on("reorder", ({ pageOrder }: { pageOrder: string[] }) => {
      setTeamUpdate({ type: "reorder", pageOrder });
    });

    ws.on(
      "newPage",
      ({
        pageID,
        newPage,
        pageOrder,
      }: {
        userID: string;
        pageOrder: string[];
        pageID: string;
        newPage: NotePage;
      }) => {
        setTeamStateSet((prev) => prev?.addPage(pageID, newPage));
        newPage = createTeamPage(newPage);
        setTeamUpdate({
          type: "newPage",
          pageOrder,
          pageID,
          newPage,
        });
      }
    );

    ws.on("connect", () => setConnected(true));
    ws.on("disconnect", () => setConnected(false));

    ws.connect();
  };

  const roomDestroy = () => {
    ws.removeAllListeners();
    ws.disconnect();
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  }, [noteID]);

  const pushOperation = (op: SetOperation) => {
    ws.emit("push", { operation: op });
  };

  const updateReorder = (pageOrder: string[]) => {
    ws.emit("reorder", { pageOrder });
  };

  const updateNewPage = (
    pageOrder: string[],
    pageID: string,
    newPage: NotePage
  ) => {
    setTeamStateSet((prev) => prev?.addPage(pageID, newPage));
    const { image, marked, ...newTeamPage } = newPage;
    ws.emit("newPage", { pageOrder, pageID, newPage: newTeamPage });
  };

  return (
    <TeamCtx.Provider
      value={{
        code,
        ignores,
        userList,
        loadInfo,
        connected,
        setIgnores,
        teamUpdate,
        teamStateSet,
        pushOperation,
        updateReorder,
        updateNewPage,
      }}
    >
      {loaded && <Reader teamOn />}
    </TeamCtx.Provider>
  );
}
