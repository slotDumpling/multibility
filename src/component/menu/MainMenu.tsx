import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./menu.sass";
import { createEmptyNote, NoteInfo } from "../../lib/note/note";
import {
  createNewNote,
  getAllNotes,
  getAllTags,
  NoteTag,
} from "../../lib/note/archive";
import RightTools from "./RightTools";
import LeftTools from "./LeftTools";
import SideMenu from "./SideMenu";
import NoteList from "./NoteList";
import Title from "antd/lib/typography/Title";
import { Button } from "antd";
import { FormOutlined } from "@ant-design/icons";

export const MenuStateCtx = createContext({
  tagUid: "DEFAULT",
  editing: false,
  allNotes: {} as Record<string, NoteInfo>,
  allTags: {} as Record<string, NoteTag>,
});

export const MenuStateUpdateCtx = createContext({
  setAllNotes: (() => {}) as Dispatch<SetStateAction<Record<string, NoteInfo>>>,
  setAllTags: (() => {}) as Dispatch<SetStateAction<Record<string, NoteTag>>>,
  setTagUid: (() => {}) as Dispatch<SetStateAction<string>>,
  setEditing: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

export default function MainMenu() {
  const [allNotes, setAllNotes] = useState<Record<string, NoteInfo>>({});
  const [allTags, setAllTags] = useState<Record<string, NoteTag>>({});
  const [tagUid, setTagUid] = useState("DEFAULT");
  const [editing, setEditing] = useState(false);

  const selectedTag = useMemo<NoteTag>(() => {
    if (tagUid === "DEFAULT") {
      return {
        uid: "",
        name: "All Notes",
        color: "#000",
        notes: Object.keys(allNotes),
      };
    } else {
      return allTags[tagUid];
    }
  }, [tagUid, allTags, allNotes]);

  const noteList = useMemo<NoteInfo[]>(
    () =>
      selectedTag.notes
        .filter((uid) => uid in allNotes)
        .map((uid) => allNotes[uid]),
    [selectedTag, allNotes]
  );

  useEffect(() => {
    getAllNotes().then(setAllNotes);
    getAllTags().then(setAllTags);
  }, []);

  return (
    <MenuStateCtx.Provider value={{ tagUid, editing, allNotes, allTags }}>
      <MenuStateUpdateCtx.Provider
        value={{ setAllNotes, setAllTags, setEditing, setTagUid }}
      >
        <div id="menu-container">
          <header>
            <LeftTools />
            <Title level={4}>{selectedTag.name}</Title>
            <RightTools />
          </header>
          <main>
            <SideMenu />
            <NoteList noteList={noteList} />
            <NewNoteButton />
          </main>
        </div>
      </MenuStateUpdateCtx.Provider>
    </MenuStateCtx.Provider>
  );
}

export const NewNoteButton = () => {
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
      id="new-note"
      size="large"
      type="primary"
      shape="circle"
      onClick={addNewNote}
      icon={<FormOutlined />}
    />
  );
};
