import { FC, useMemo, useState, useEffect, useContext } from "react";
import {
  NoteTag,
  deleteNote,
  moveNoteTag,
  editNoteData,
} from "../../lib/note/archive";
import { CloudOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import { MenuCtx } from "./MainMenu";
import { NoteInfo } from "../../lib/note/note";
import { useNavigate } from "react-router-dom";
import calender from "dayjs/plugin/calendar";
import { SwipeDelete, SwipeDeleteContext } from "../ui/SwipeDelete";
import dafaultImg from "../ui/default.png";
import { Setter } from "../../lib/hooks";
import { List, Set } from "immutable";
import classNames from "classnames";
import dayjs from "dayjs";
import { HeadTools } from "./HeadTools";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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
        <HeadTools
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
            <CSSTransition key={uid} timeout={500}>
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
  const { team, uid, name, thumbnail, lastTime } = noteInfo;
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

  return (
    <div
      className={classNames("note-item", { selected })}
      onClick={handleClick}
    >
      <div className="timg-wrapper">
        <img src={thumbnail || dafaultImg} alt={name} className="timg" />
        {team && (
          <Tag color="blue" className="cloud-icon">
            <CloudOutlined />
          </Tag>
        )}
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
