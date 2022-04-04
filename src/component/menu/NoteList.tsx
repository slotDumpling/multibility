import { Button, Input, Popconfirm, Tag, Dropdown, Menu } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteNote, editNoteData, moveNoteTag } from "../../lib/note/archive";
import { NoteInfo } from "../../lib/note/note";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  TagsOutlined,
  CloudOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TagCircle } from "./SideMenu";
import dafaultImg from "../ui/default.png";
import { preloadTeamNote } from "../../lib/network/http";
import { useObjectUrl } from "../../lib/hooks";

export default function NoteList({ noteList }: { noteList: NoteInfo[] }) {
  return (
    <div className="note-list">
      {noteList.map((noteInfo) => (
        <NoteItem key={noteInfo.uid} noteInfo={noteInfo} />
      ))}
    </div>
  );
}

const NoteItem = ({ noteInfo }: { noteInfo: NoteInfo }) => {
  const { team, uid, name, thumbnail } = noteInfo;

  const { editing, allTags } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);
  const [noteName, setNoteName] = useState(name);
  const [imgLoaded, setImgLoaded] = useState(false);
  const nav = useNavigate();
  const url = useObjectUrl(thumbnail);
  const href = editing ? "#" : `${team ? "team" : "reader"}/${uid}`;

  async function removeNote() {
    const { tags, allNotes } = await deleteNote(uid);
    setAllTags(tags);
    setAllNotes(allNotes);
  }

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
        <Button type="text" icon={<TagsOutlined />} />
      </Dropdown>
    );
  };

  const DeleteButton = () => (
    <Popconfirm
      title="Delete this note?"
      onConfirm={removeNote}
      okText="Yes"
      icon={<DeleteOutlined />}
      okType="danger"
      cancelText="No"
    >
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
      />
    </Popconfirm>
  );

  return (
    <div className="list-item" onClick={async () => {
      if (team) {
        await preloadTeamNote(uid);
        nav(href);
      } else {
        nav(href);
      }
    }}>
      <div className="thumbnail-wrapper">
        <img
          src={url || dafaultImg}
          alt={name}
          className={`thumbnail${imgLoaded ? " loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
        />
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
  );
};
