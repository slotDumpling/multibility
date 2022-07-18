import { useEffect, useState } from "react";
import { getAllNotes, getAllTags, NoteTag } from "lib/note/archive";
import { NoteInfo } from "lib/note/note";
import { AsideOpenProvider, Setter } from "lib/hooks";
import { SideMenu } from "./Aside";
import { NoteList } from "./NoteList";

export interface MenuProps {
  currTagID: string;
  allNotes: Record<string, NoteInfo>;
  allTags: Record<string, NoteTag>;
  setAllNotes: Setter<Record<string, NoteInfo>>;
  setAllTags: Setter<Record<string, NoteTag>>;
  setCurrTagID: Setter<string>;
}

export default function MainMenu() {
  const [allNotes, setAllNotes] = useState<Record<string, NoteInfo>>({});
  const [allTags, setAllTags] = useState<Record<string, NoteTag>>({});
  const [currTagID, setCurrTagID] = useState("DEFAULT");

  useEffect(() => {
    getAllNotes().then(setAllNotes);
    getAllTags().then(setAllTags);
    document.title = "Multibility";
  }, []);

  const menuProps: MenuProps = {
    allNotes,
    allTags,
    setAllNotes,
    setAllTags,
    currTagID,
    setCurrTagID,
  };

  return (
    <div className="main-menu container">
      <AsideOpenProvider>
        <SideMenu {...menuProps} />
        <NoteList {...menuProps} />
      </AsideOpenProvider>
    </div>
  );
}
