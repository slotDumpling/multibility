import { Button, Popover } from "antd";
import { MenuOutlined, FormOutlined, TeamOutlined } from "@ant-design/icons";
import { FC, useState } from "react";
import { createEmptyNote } from "lib/note/note";
import { createNewNote } from "lib/note/archive";
import { useNavigate } from "react-router-dom";
import { getNoteID } from "lib/network/http";
import { PasscodeInput } from "antd-mobile";
import { OthersMenu } from "./Others";
import { useAsideOpen } from "lib/hooks";
import { MenuProps } from "../Menu";

export const NoteNav: FC<MenuProps> = (props) => {
  return (
    <nav>
      <Left {...props} />
      <Right {...props} />
    </nav>
  );
};

const Left: FC<MenuProps> = ({ allTags, currTagID }) => {
  const [, setAsideOpen] = useAsideOpen();

  const title = allTags[currTagID]?.name ?? "All notes";
  return (
    <div className="nav-left">
      <Button
        className="aside-btn small"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setAsideOpen(true)}
      />
      <h2>
        <b>{title}</b>
      </h2>
    </div>
  );
};

const Right: FC<MenuProps> = (props) => {
  return (
    <div className="nav-right">
      <NewNoteButton {...props} />
      <JoinTeamButton />
      <OthersMenu {...props} />
    </div>
  );
};

const NewNoteButton: FC<MenuProps> = ({
  currTagID,
  setAllTags,
  setAllNotes,
}) => {
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
      onOpenChange={() => setWrong(false)}
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
