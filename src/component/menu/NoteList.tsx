import { Button, Input, Popconfirm, Tag, Dropdown, Menu } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteNote, editNoteData, moveNoteTag } from "../../lib/note/archive";
import { NoteInfo } from "../../lib/note/note";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {
  CloudOutlined,
  DeleteOutlined,
  TagsOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { TagCircle } from "./SideMenu";
import dafaultImg from "../ui/default.png";

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
  const { editing, allTags } = useContext(MenuStateCtx);
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

  const move = async ({ key }: { key: string }) => {
    const { tags, allNotes } = await moveNoteTag(uid, key);
    setAllTags(tags);
    setAllNotes(allNotes);
  };

  const TagButton = () => {
    const { Item } = Menu;
    const overlay = (
      <Menu onClick={move}>
        <Item key="DEFAULT">
          <div className="tag-select">
            <CloseOutlined className="none-tag-icon" />
            <span>None Tag</span>
          </div>
        </Item>
        {Object.values(allTags).map((t) => (
          <Item key={t.uid}>
            <div className="tag-select">
              <TagCircle color={t.color} />
              <span>{t.name}</span>
            </div>
          </Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={overlay} trigger={["click"]}>
        <Button className="note-delete" type="text" icon={<TagsOutlined />} />
      </Dropdown>
    );
  };

  const DeleteButton = () => (
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
  );

  return (
    <Link to={href}>
      <div className="list-item">
        <div className="thumbnail-wrapper">
          <img src={url || dafaultImg} alt={name} className="thumbnail" />
          {team && (
            <Tag color="blue" className="cloud-icon">
              <CloudOutlined />
            </Tag>
          )}
        </div>
        {editing || <p className="note-name">{name}</p>}
        {editing && (
          <>
            <Input
              className="note-name-input"
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
              onBlur={saveNoteName}
            />
            <TagButton />
            <DeleteButton />
          </>
        )}
      </div>
    </Link>
  );
};
