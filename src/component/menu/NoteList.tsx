import { Button, Input, Popconfirm, Tag } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteNote, editNoteData } from "../../lib/note/archive";
import { NoteInfo } from "../../lib/note/note";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import { CloudOutlined, DeleteOutlined } from "@ant-design/icons";

export default function NoteList({ noteList }: { noteList: NoteInfo[] }) {
  return (
    <div id="note-list">
      {noteList.map((noteInfo) => (
        <NoteItem key={noteInfo.uid} noteInfo={noteInfo} />
      ))}
    </div>
  );
}

const NoteItem = ({ noteInfo }: { noteInfo: NoteInfo }) => {
  const { editing } = useContext(MenuStateCtx);
  const { team, uid, name, thumbnail } = noteInfo;
  const href = editing ? "#" : `${team ? "team" : "reader"}/${uid}`;
  const { setAllTags, setAllNotes } = useContext(MenuStateUpdateCtx);
  const [noteName, setNoteName] = useState(name);

  async function removeNote() {
    const { tags, allNotes } = await deleteNote(uid);
    setAllTags(tags);
    setAllNotes(allNotes);
  }

  const url = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : null),
    [thumbnail]
  );

  useEffect(() => {
    const prevUrl = url || "";
    return () => URL.revokeObjectURL(prevUrl);
  }, [url]);

  const saveNoteName = () => {
    editNoteData(uid, { name: noteName });
    setAllNotes((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], name: noteName },
    }));
  };

  return (
    <Link to={href}>
      <div className="list-item">
        <div className="thumbnail-wrapper">
          <img src={url || "/default.png"} alt={name} className="thumbnail" />
          {team && (
            <Tag color="blue" className="cloud-icon">
              <CloudOutlined />
            </Tag>
          )}
        </div>
        {editing || <p className="note-name">{name}</p>}
        {editing && (
          <Input
            className="note-name-input"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
            onBlur={saveNoteName}
          />
        )}
        {editing && (
          <Popconfirm
            title="Delete this note?"
            onConfirm={removeNote}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="note-delete"
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        )}
      </div>
    </Link>
  );
};
