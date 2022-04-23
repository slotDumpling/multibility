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
import { getUserId, UserInfo } from "../../lib/user";
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
    | ((pageOrder: string[], pageId: string, newPage: NotePage) => void),
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
      pageId: string;
      newPage: NotePage;
    };

export default function Team() {
  const noteId = useParams().noteId ?? "";
  const [teamStateSet, setTeamStateSet] = useState<TeamState>();
  const [code, setCode] = useState(-2);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [ignores, setIgnores] = useState(Set<string>());
  const [ws] = useState(IoFactory(noteId));
  const [teamUpdate, setTeamUpdate] = useState<TeamUpdate>();
  const [loaded, setLoaded] = useState(false);
  const [connected, setConnected] = useState(true);
  const nav = useNavigate();

  const loadState = async () => {
    const teamNote = await getTeamNoteState(noteId);
    if (!teamNote) {
      message.error("Failed loading the team note state");
      return false;
    }
    setTeamStateSet(TeamState.createFromTeamPages(teamNote, WIDTH));
    return true;
  };

  const loadInfo = async () => {
    const info = await loadTeamNoteInfo(noteId);
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
    ws.on("push", ({ operation, userId }) => {
      setTeamStateSet((prev) => prev?.pushOperation(operation, userId, WIDTH));
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
        newPage: NotePage;
      }) => {
        setTeamStateSet((prev) => prev?.addPage(pageId, newPage));
        newPage = createTeamPage(newPage);
        setTeamUpdate({
          type: "newPage",
          pageOrder,
          pageId,
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
    setTeamStateSet((prev) => prev?.addPage(pageId, newPage));
    const { image, marked, ...newTeamPage } = newPage;
    ws.emit("newPage", { pageOrder, pageId, newPage: newTeamPage });
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
