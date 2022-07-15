import React, { useEffect, useMemo, useState } from "react";
import { getAllNotes, getAllTags, NoteTag } from "lib/note/archive";
import { NoteInfo } from "lib/note/note";
import { AsideOpenProvider, Setter } from "lib/hooks";
import { SideMenu } from "./aside";
import { NoteList } from "./notes";
import { List } from "immutable";

export const MenuCtx = React.createContext({
  currTagID: "DEFAULT",
  editing: false,
  allNotes: {} as Record<string, NoteInfo>,
  allTags: {} as Record<string, NoteTag>,
  setAllNotes: (() => {}) as Setter<Record<string, NoteInfo>>,
  setAllTags: (() => {}) as Setter<Record<string, NoteTag>>,
  setCurrTagID: (() => {}) as Setter<string>,
  setEditing: (() => {}) as Setter<boolean>,
  menuInit: () => {},
});

export default function MainMenu() {
  const [allNotes, setAllNotes] = useState<Record<string, NoteInfo>>({});
  const [allTags, setAllTags] = useState<Record<string, NoteTag>>({});
  const [currTagID, setCurrTagID] = useState("DEFAULT");
  const [editing, setEditing] = useState(false);

  const selectedTag = useMemo(
    () =>
      allTags[currTagID] ?? {
        uid: "",
        name: "All Notes",
        color: "#000000",
        notes: Object.keys(allNotes),
      },
    [allNotes, allTags, currTagID]
  );

  const noteList = useMemo(
    () =>
      List(
        selectedTag.notes
          .map((uid) => allNotes[uid])
          .filter((n): n is NoteInfo => n !== undefined)
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
        currTagID,
        editing,
        allNotes,
        allTags,
        setAllNotes,
        setAllTags,
        setEditing,
        setCurrTagID,
        menuInit,
      }}
    >
      <div className="main-menu container">
        <AsideOpenProvider>
          <SideMenu />
          <NoteList noteList={noteList} />
        </AsideOpenProvider>
      </div>
    </MenuCtx.Provider>
  );
}
