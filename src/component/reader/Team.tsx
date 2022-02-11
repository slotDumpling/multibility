import { Button, Divider, Popover } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stroke } from "../../lib/draw/DrawState";
import { StateSet } from "../../lib/draw/StateSet";
import { getTeamNote, getUserId } from "../../lib/http/http";
import { getIO } from "../../lib/socket/io";
import DigitDisplay from "../ui/DigitDisplay";
import Reader, { WIDTH } from "./Reader";
import { TeamOutlined } from "@ant-design/icons";
import './reader.css';

const TeamStateCtx = createContext({
  code: -2,
});

export default function Team() {
  const [teamStateSet, setTeamStateSet] = useState<StateSet>();
  const [code, setCode] = useState(-2);
  const [ws] = useState(getIO);
  const noteId = useParams().noteId ?? "";

  async function loadTeamPages() {
    const res = await getTeamNote(noteId);
    if (!res) return;
    const { code, pages } = res;
    setCode(code);
    setTeamStateSet(StateSet.createFromPages(pages, WIDTH));
  }

  const joinRoom = () => {
    ws.emit("joinRoom", {
      noteId,
      userId: getUserId(),
    });
  };

  const leavRoom = () => {
    ws.emit("leaveRoom", {
      noteId,
      userId: getUserId(),
    });
  };

  const roomInit = async () => {
    await loadTeamPages();
    joinRoom();
    ws.on("connect", () => {
      console.log("on-conn");
      joinRoom();
    });
    ws.on("addStroke", ({ pageId, stroke }) => {
      console.log("on-add");
      setTeamStateSet((prev) => prev?.pushStroke(pageId, stroke));
    });
  };

  const roomDestroy = () => {
    leavRoom();
    ws.off("connect");
    ws.off("addStroke");
  };

  useEffect(() => {
    roomInit();
    return roomDestroy;
  }, [noteId]);

  const pushStroke = (pageId: string, stroke: Stroke) => {
    ws.emit("pushStroke", {
      pageId,
      userId: getUserId(),
      stroke,
    });
  };

  return (
    <TeamStateCtx.Provider value={{ code }}>
      <Reader
        teamOn={true}
        teamStateSet={teamStateSet}
        pushStroke={pushStroke}
      />
    </TeamStateCtx.Provider>
  );
}

export function RoomCode() {
  const { code } = useContext(TeamStateCtx);

  const content = (
    <div className="team-popover">
      <p>Room Code:</p>
      <DigitDisplay value={code} />
      <Divider />
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight" title="Team info">
      <Button type="text" icon={<TeamOutlined />} />
    </Popover>
  );
}
