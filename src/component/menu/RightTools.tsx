import { Button, message, Popover } from "antd";
import { ChangeEvent, useContext, useRef, useState } from "react";
import { createNewNote } from "../../lib/note/archive";
import { LoadPDF } from "../../lib/note/pdfImage";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {
  LoadingOutlined,
  DownloadOutlined,
  FormOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { createEmptyNote } from "../../lib/note/note";
import { useNavigate } from "react-router-dom";
import { getNoteId } from "../../lib/http/http";
import DigitInput from "../ui/DigitInput";

export default function RightTools() {
  return (
    <div id="right-tools">
      <JoinTeamButton />
      <UploadPdfButton />
      <NewNoteButton />
    </div>
  );
};

function UploadPdfButton() {
  const [loading, setLoading] = useState(false);
  const fakeUpload = useRef<HTMLInputElement>(null);
  const { tagUid } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuStateUpdateCtx);

  function handleClick() {
    fakeUpload.current?.click();
  }

  async function inputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length !== 1) return;
    const file = files[0];
    if (file.type !== "application/pdf") return;

    setLoading(true);
    const note = await LoadPDF(file);
    note.tagId = tagUid;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
    setLoading(false);
    message.success("PDF Loaded");
  }

  return (
    <>
      <input
        ref={fakeUpload}
        type="file"
        onChange={inputChange}
        accept="application/pdf"
        multiple={false}
      />
      <Button
        onClick={handleClick}
        type="text"
        shape="circle"
        disabled={loading}
        icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
      />
    </>
  );
}

function NewNoteButton() {
  const { tagUid } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuStateUpdateCtx);

  async function addNewNote() {
    const note = createEmptyNote();
    note.tagId = tagUid;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
  }

  return (
    <Button
      type="primary"
      shape="circle"
      onClick={addNewNote}
      icon={<FormOutlined />}
    />
  );
}

function JoinTeamButton() {
  const [roomCode, setRoomCode] = useState(0);

  const nav = useNavigate();
  async function handleSubmit(code: number) {
    const noteId = await getNoteId(code);
    if (!noteId) {
      setRoomCode(0);
      message.error("Room doesn't exist.");
    } else {
      nav(`/team/${noteId}`);
    }
  }

  return (
    <Popover
      trigger="click"
      title="Join a team note."
      content={
        <DigitInput
          value={roomCode}
          onChange={setRoomCode}
          onSubmit={handleSubmit}
        />
      }
    >
      <Button icon={<TeamOutlined />} type="text" shape="circle" />
    </Popover>
  );
}
