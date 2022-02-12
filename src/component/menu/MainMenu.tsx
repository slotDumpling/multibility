import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./menu.css";
import { NoteInfo } from "../../lib/note/note";
import {
  getAllNotes,
  getAllTags,
  getTagList,
  NoteTag,
} from "../../lib/note/archive";
import RightTools from "./RightTools";
import LeftTools from "./LeftTools";
import SideMenu from "./SideMenu";
import NoteList from "./NoteList";
import Title from "antd/lib/typography/Title";

export const MenuStateCtx = createContext({
  tagUid: "DEFAULT",
  editing: false,
  tagList: [] as string[],
  allNotes: {} as Record<string, NoteInfo>,
  allTags: {} as Record<string, NoteTag>,
});

export const MenuStateUpdateCtx = createContext({
  setTagList: (() => {}) as Dispatch<SetStateAction<string[]>>,
  setAllNotes: (() => {}) as Dispatch<SetStateAction<Record<string, NoteInfo>>>,
  setAllTags: (() => {}) as Dispatch<SetStateAction<Record<string, NoteTag>>>,
  setTagUid: (() => {}) as Dispatch<SetStateAction<string>>,
  setEditing: (() => {}) as Dispatch<SetStateAction<boolean>>,
});



export default function MainMenu() {
  const [tagList, setTagList] = useState<string[]>([]);
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
    getTagList().then(setTagList);
  }, []);

  return (
    <MenuStateCtx.Provider value={{ tagUid, editing, allNotes, allTags, tagList }}>
      <MenuStateUpdateCtx.Provider
        value={{ setAllNotes, setAllTags, setEditing, setTagList, setTagUid }}
      >
        <div id="container">
          <header>
            <LeftTools />
            <Title level={4}>{selectedTag.name}</Title>
            <RightTools />
          </header>
          <main>
            <SideMenu />
            <NoteList noteList={noteList} />
          </main>
        </div>
      </MenuStateUpdateCtx.Provider>
    </MenuStateCtx.Provider>
  );
}
