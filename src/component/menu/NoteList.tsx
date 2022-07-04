import { FC, useMemo, useState, useEffect, useContext } from "react";
import {
  NoteTag,
  deleteNote,
  moveNoteTag,
  editNoteData,
  loadNote,
} from "../../lib/note/archive";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CloudTwoTone, CheckCircleFilled } from "@ant-design/icons";
import { SwipeDelete, SwipeDeleteContext } from "../ui/SwipeDelete";
import { NoteInfo, NotePage } from "../../lib/note/note";
import { useNavigate } from "react-router-dom";
import calender from "dayjs/plugin/calendar";
import dafaultImg from "../ui/default.png";
import { Setter } from "../../lib/hooks";
import { NoteHeader } from "./NoteHeader";
import { List, Set } from "immutable";
import { MenuCtx } from "./MainMenu";
import { Input } from "antd";
import dayjs from "dayjs";
import { DrawState, WIDTH } from "../../lib/draw/DrawState";
import { PageWrapper } from "../reader/Reader";

dayjs.extend(calender);

export default function NoteList({ noteList }: { noteList: List<NoteInfo> }) {
  const { editing, setAllTags, setAllNotes } = useContext(MenuCtx);
  const [sortType, setSortType] = useState("LAST");
  const [searchText, setSearchText] = useState("");
  const [selectedNotes, setSelectNotes] = useState(Set<string>());

  const removeNotes = async (uids: string[]) => {
    let tags: Record<string, NoteTag> | undefined;
    let allNotes: Record<string, NoteInfo> | undefined;
    for (let uid of uids) {
      const res = await deleteNote(uid);
      tags = res.tags;
      allNotes = res.allNotes;
    }
    tags && setAllTags(tags);
    allNotes && setAllNotes(allNotes);
  };

  const moveNotes = async (noteIDs: string[], tagID: string) => {
    let tags: Record<string, NoteTag> | undefined;
    let allNotes: Record<string, NoteInfo> | undefined;
    for (let noteID of noteIDs) {
      const res = await moveNoteTag(noteID, tagID);
      tags = res.tags;
      allNotes = res.allNotes;
    }
    tags && setAllTags(tags);
    allNotes && setAllNotes(allNotes);
  };

  const sortedList = useMemo(() => {
    const comparator = (t0: number, t1: number) => t1 - t0;
    switch (sortType) {
      case "CREATE":
        return noteList.sortBy((n) => n.createTime, comparator);
      case "LAST":
        return noteList.sortBy((n) => n.lastTime, comparator);
      case "NAME":
        return noteList.sortBy((n) => n.name.toUpperCase());
      default:
        return noteList;
    }
  }, [noteList, sortType]);

  const filterdList = useMemo(
    () =>
      sortedList.filter((n) =>
        n.name.toUpperCase().includes(searchText.trim().toUpperCase())
      ),
    [searchText, sortedList]
  );

  useEffect(() => {
    setSearchText("");
    setSelectNotes(Set());
  }, [noteList, editing]);

  return (
    <SwipeDeleteContext>
      <TransitionGroup className="note-list">
        <NoteHeader
          sortType={sortType}
          setSortType={setSortType}
          searchText={searchText}
          setSearchText={setSearchText}
          onDelete={() => removeNotes(selectedNotes.toArray())}
          onMove={(tagID) => moveNotes(selectedNotes.toArray(), tagID)}
          disabled={selectedNotes.size === 0}
        />
        {filterdList.map((noteInfo) => {
          const { uid } = noteInfo;
          const removeNote = () => removeNotes([uid]);
          return (
            <CSSTransition key={uid} timeout={300}>
              <SwipeDelete
                className="note-wrapper"
                onDelete={removeNote}
                disable={editing}
              >
                <NoteItem
                  noteInfo={noteInfo}
                  selected={selectedNotes.has(uid)}
                  setSelectNotes={setSelectNotes}
                />
              </SwipeDelete>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </SwipeDeleteContext>
  );
}

const NoteItem: FC<{
  noteInfo: NoteInfo;
  selected: boolean;
  setSelectNotes: Setter<Set<string>>;
}> = ({ noteInfo, selected, setSelectNotes }) => {
  const { team, uid, name, lastTime } = noteInfo;
  const date = useMemo(() => dayjs(lastTime).calendar(), [lastTime]);
  const href = `${team ? "team" : "reader"}/${uid}`;

  const { editing, setAllNotes } = useContext(MenuCtx);
  const [noteName, setNoteName] = useState(name);
  const nav = useNavigate();

  const saveNoteName = () => {
    const newName = noteName.trim();
    if (!newName || newName === name) return setNoteName(name);
    editNoteData(uid, { name: newName });
    setAllNotes((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], name: newName },
    }));
  };

  const handleClick = () => {
    if (!editing) return nav(href);
    setSelectNotes((prev) => {
      if (prev.has(uid)) return prev.delete(uid);
      return prev.add(uid);
    });
  };

  const [firstPage, setFirstPage] = useState<NotePage>();
  const drawState = useMemo(
    () =>
      firstPage &&
      DrawState.loadFromFlat(firstPage.state, WIDTH, WIDTH * firstPage.ratio),
    [firstPage]
  );
  useEffect(() => {
    (async () => {
      const stored = await loadNote(uid);
      if (!stored) return;
      const { pageRec, pageOrder } = stored;
      const firstID = pageOrder[0];
      firstID && setFirstPage(pageRec[firstID]);
    })();
  }, [uid]);

  if (!firstPage || !drawState) return null;
  return (
    <div className="note-item" data-selected={selected} onClick={handleClick}>
      <div className="timg-wrapper" data-landscape={firstPage.ratio < 1}>
        <PageWrapper
          drawState={drawState}
          thumbnail={firstPage.image || dafaultImg}
          preview
        />
        {team && <CloudTwoTone className="cloud-icon" />}
        <CheckCircleFilled className="checked-icon" />
      </div>
      <div className="content">
        {editing || <p className="name">{name}</p>}
        {editing && (
          <Input
            className="name-input"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={saveNoteName}
          />
        )}
        <span className="date">{date}</span>
      </div>
    </div>
  );
};
