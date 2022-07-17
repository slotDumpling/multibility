import React, { useEffect, useState } from "react";
import { getAllNotes, getAllTags, NoteTag } from "lib/note/archive";
import { NoteInfo } from "lib/note/note";
import { AsideOpenProvider, Setter } from "lib/hooks";
import { SideMenu } from "./aside";
import { NoteList } from "./notes";

export const MenuCtx = React.createContext({
  currTagID: "DEFAULT",
  allNotes: {} as Record<string, NoteInfo>,
  allTags: {} as Record<string, NoteTag>,
  setAllNotes: (() => {}) as Setter<Record<string, NoteInfo>>,
  setAllTags: (() => {}) as Setter<Record<string, NoteTag>>,
  setCurrTagID: (() => {}) as Setter<string>,
});

export default function MainMenu() {
  const [allNotes, setAllNotes] = useState<Record<string, NoteInfo>>({});
  const [allTags, setAllTags] = useState<Record<string, NoteTag>>({});
  const [currTagID, setCurrTagID] = useState("DEFAULT");

  useEffect(() => {
    getAllNotes().then(setAllNotes);
    getAllTags().then(setAllTags);
    document.title = "Multibility";
  }, []);

  return (
    <MenuCtx.Provider
      value={{
        currTagID,
        allNotes,
        allTags,
        setAllNotes,
        setAllTags,
        setCurrTagID,
      }}
    >
      <div className="main-menu container">
        <AsideOpenProvider>
          <SideMenu />
          <NoteList />
        </AsideOpenProvider>
      </div>
    </MenuCtx.Provider>
  );
}
