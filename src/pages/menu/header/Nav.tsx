import { Button, Popover } from "antd";
import { MenuOutlined, FormOutlined, TeamOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { MenuCtx } from "../Menu";
import { createEmptyNote } from "lib/note/note";
import { createNewNote } from "lib/note/archive";
import { useNavigate } from "react-router-dom";
import { getNoteID } from "lib/network/http";
import { PasscodeInput } from "antd-mobile";
import { OthersMenu } from "./Others";

export const Nav = () => {
  return (
    <nav>
      <Left />
      <Right />
    </nav>
  );
};

const Left = () => {
  const { allTags, currTagID } = useContext(MenuCtx);
  const title = allTags[currTagID]?.name ?? "All notes";
  return (
    <div className="nav-left">
      <label htmlFor="aside-check" className="aside-label">
        <Button
          style={{ pointerEvents: "none" }}
          className="aside-btn small"
          type="text"
          icon={<MenuOutlined />}
        />
      </label>
      <h2>
        <b>{title}</b>
      </h2>
    </div>
  );
};

const Right = () => {
  return (
    <div className="nav-right">
      <NewNoteButton />
      <JoinTeamButton />
      <OthersMenu />
    </div>
  );
};

const NewNoteButton = () => {
  const { currTagID, setAllTags, setAllNotes } = useContext(MenuCtx);

  async function addNewNote() {
    const note = createEmptyNote();
    note.tagID = currTagID;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
  }

  return (
    <>
      <Button
        className="new-note large"
        type="primary"
        shape="round"
        onClick={addNewNote}
        icon={<FormOutlined />}
      >
        New
      </Button>
      <Button
        className="new-note small"
        type="link"
        onClick={addNewNote}
        icon={<FormOutlined />}
      />
    </>
  );
};

const JoinTeamButton = () => {
  const [roomCode, setRoomCode] = useState("");
  const [wrong, setWrong] = useState(false);

  const nav = useNavigate();
  async function handleSubmit(code: string) {
    const noteID = await getNoteID(code);
    if (noteID) return nav(`/team/${noteID}`);
    setRoomCode("");
    setWrong(true);
  }

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      title="Join a team note"
      destroyTooltipOnHide
      onVisibleChange={() => setWrong(false)}
      content={
        <PasscodeInput
          plain
          length={4}
          error={wrong}
          value={roomCode}
          onChange={(v) => {
            setWrong(false);
            setRoomCode(v);
          }}
          onFill={handleSubmit}
        />
      }
    >
      <Button className="team-btn large" shape="round" icon={<TeamOutlined />}>
        Team
      </Button>
      <Button className="team-btn small" type="text" icon={<TeamOutlined />} />
    </Popover>
  );
};