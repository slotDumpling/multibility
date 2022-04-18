import { Button, Input, Popconfirm, Tag, Dropdown, Menu } from "antd";
import { FC, useContext, useEffect, useState } from "react";
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
import { useObjectUrl } from "../../lib/hooks";
import classNames from "classnames";
import SwipeDelete from "../ui/SwipeDelete";

export default function NoteList({ noteList }: { noteList: NoteInfo[] }) {
  const [nowSwiped, setNowSwiped] = useState("");
  const { editing } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);

  const removeOneNote = async (uid: string) => {
    const { tags, allNotes } = await deleteNote(uid);
    setAllTags(tags);
    setAllNotes(allNotes);
  };

  return (
    <div className="note-list">
      {noteList.map((noteInfo) => {
        const { uid } = noteInfo;
        const removeNote = () => removeOneNote(uid);
        return (
          <SwipeDelete
            onDelete={removeNote}
            key={uid}
            uid={uid}
            nowSwiped={nowSwiped}
            setNowSwiped={setNowSwiped}
            disable={editing}
          >
            <NoteItem noteInfo={noteInfo} removeNote={removeNote} />
          </SwipeDelete>
        );
      })}
    </div>
  );
}

const NoteItem: FC<{
  noteInfo: NoteInfo;
  removeNote: () => void;
}> = ({ noteInfo, removeNote }) => {
  const { team, uid, name, thumbnail } = noteInfo;

  const href = `${team ? "team" : "reader"}/${uid}`;
  const nav = useNavigate();

  const { editing, allTags } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);
  const [noteName, setNoteName] = useState(name);
  const [imgLoaded, setImgLoaded] = useState(false);
  const url = useObjectUrl(thumbnail);

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
            <span>No Tag</span>
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
      title="This note will be deleted."
      onConfirm={removeNote}
      icon={<DeleteOutlined />}
      cancelText="Cancel"
      placement="left"
      okText="Delete"
      okType="danger"
      okButtonProps={{ type: "primary" }}
    >
      <Button type="text" danger icon={<DeleteOutlined />} />
    </Popconfirm>
  );

  return (
    <div className="note-item" onClick={() => !editing && nav(href)}>
      <div className="thumbnail-wrapper">
        <img
          src={url || dafaultImg}
          alt={name}
          className={classNames("thumbnail", { loaded: imgLoaded })}
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
