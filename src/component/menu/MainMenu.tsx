import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  createNewNote,
  getAllNotes,
  getAllTags,
  NoteTag,
} from "../../lib/note/archive";
import { createEmptyNote, NoteInfo } from "../../lib/note/note";
import { FormOutlined } from "@ant-design/icons";
import { Setter } from "../../lib/hooks";
import SideMenu from "./SideMenu";
import NoteList from "./NoteList";
import { List } from "immutable";
import { Button } from "antd";
import "./menu.sass";
import { MenuHeader } from "./header";

export const MenuCtx = React.createContext({
  tagUid: "DEFAULT",
  editing: false,
  allNotes: {} as Record<string, NoteInfo>,
  allTags: {} as Record<string, NoteTag>,
  setAllNotes: (() => {}) as Setter<Record<string, NoteInfo>>,
  setAllTags: (() => {}) as Setter<Record<string, NoteTag>>,
  setTagUid: (() => {}) as Setter<string>,
  setEditing: (() => {}) as Setter<boolean>,
  menuInit: () => {},
});

export default function MainMenu() {
  const [allNotes, setAllNotes] = useState<Record<string, NoteInfo>>({});
  const [allTags, setAllTags] = useState<Record<string, NoteTag>>({});
  const [tagUid, setTagUid] = useState("DEFAULT");
  const [editing, setEditing] = useState(false);

  const selectedTag = useMemo(
    () =>
      allTags[tagUid] ?? {
        uid: "",
        name: "All Notes",
        color: "#000000",
        notes: Object.keys(allNotes),
      },
    [allNotes, allTags, tagUid]
  );

  const noteList = useMemo(
    () =>
      List(
        selectedTag.notes
          .filter((uid) => uid in allNotes)
          .map((uid) => allNotes[uid])
      ),
    [selectedTag, allNotes]
  );

  const menuInit = () => {
    getAllNotes().then(setAllNotes);
    getAllTags().then(setAllTags);
    document.title = "Multibility";
  };
  useEffect(menuInit, []);

  return (
    <MenuCtx.Provider
      value={{
        tagUid,
        editing,
        allNotes,
        allTags,
        setAllNotes,
        setAllTags,
        setEditing,
        setTagUid,
        menuInit,
      }}
    >
      <div className="main-menu container">
        <MenuHeader />
        <main>
          <SideMenu />
          <NoteList noteList={noteList} />
          <NewNoteButton />
        </main>
      </div>
    </MenuCtx.Provider>
  );
}

export const NewNoteButton = () => {
  const { tagUid, setAllTags, setAllNotes } = useContext(MenuCtx);

  async function addNewNote() {
    const note = createEmptyNote();
    note.tagID = tagUid;
    const { tags, allNotes } = await createNewNote(note);
    setAllTags(tags);
    setAllNotes(allNotes);
  }

  return (
    <Button
      className="new-note"
      size="large"
      type="primary"
      shape="circle"
      onClick={addNewNote}
      icon={<FormOutlined />}
    />
  );
};
