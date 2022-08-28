import React, { FC, useMemo, useState, useEffect, Suspense } from "react";
import { deleteNote, editNoteData, loadNote } from "lib/note/archive";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CloudTwoTone, CheckCircleFilled } from "@ant-design/icons";
import { SwipeDelete, SwipeDeleteProvider } from "component/SwipeDelete";
import { Note, NoteInfo, TeamPageRec } from "lib/note/note";
import { DrawState } from "lib/draw/DrawState";
import { useNavigate } from "react-router-dom";
import { Setter } from "lib/hooks";
import { List, Set } from "immutable";
import { Input } from "antd";
import { loadCachedTeamState } from "lib/network/http";
import { TeamState } from "lib/draw/TeamState";
import { getColorPalette } from "lib/color";
import { NoteNav, ListTools } from "../Header";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import { MenuProps } from "../Menu";
dayjs.extend(calender);

export const NoteList: FC<MenuProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [sortType, setSortType] = useState("LAST");
  const [searchText, setSearchText] = useState("");
  const [selectedNotes, setSelectNotes] = useState(Set<string>());

  const { setAllTags, setAllNotes } = props;
  const removeNote = async (uid: string) => {
    const { tags, allNotes } = await deleteNote(uid);
    setAllNotes(allNotes);
    setAllTags(tags);
  };

  const { currTagID, allNotes, allTags } = props;
  const noteList = useMemo(
    () =>
      List(
        (allTags[currTagID]?.notes ?? Object.keys(allNotes))
          .map((uid) => allNotes[uid])
          .filter((n): n is NoteInfo => n !== undefined)
      ),
    [allNotes, allTags, currTagID]
  );

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
    <div className="note-list">
      <header>
        <NoteNav {...props} />
        <ListTools
          sortType={sortType}
          setSortType={setSortType}
          editing={editing}
          setEditing={setEditing}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedNotes={selectedNotes}
          {...props}
        />
      </header>
      <SwipeDeleteProvider>
        <TransitionGroup component={null}>
          {filterdList.map((noteInfo, index) => {
            const { uid } = noteInfo;
            const selected = selectedNotes.has(uid);
            const nextUid = filterdList.get(index + 1)?.uid;
            const last = (nextUid && selectedNotes.has(nextUid)) !== selected;
            return (
              <CSSTransition key={uid} timeout={300}>
                {(state) => (
                  <SwipeDelete
                    className="note-wrapper"
                    onDelete={() => removeNote(uid)}
                    disable={editing}
                    data-last={last}
                    data-selected={selected}
                  >
                    <NoteItem
                      timgShow={/^(entered|exiting)$/.test(state)}
                      noteInfo={noteInfo}
                      selected={selected}
                      editing={editing}
                      setSelectNotes={setSelectNotes}
                      {...props}
                    />
                  </SwipeDelete>
                )}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </SwipeDeleteProvider>
    </div>
  );
};

const NoteItem: FC<
  {
    noteInfo: NoteInfo;
    selected: boolean;
    editing: boolean;
    setSelectNotes: Setter<Set<string>>;
    timgShow: boolean;
  } & MenuProps
> = ({
  noteInfo,
  selected,
  editing,
  setSelectNotes,
  setAllNotes,
  allTags,
  currTagID,
  timgShow,
}) => {
  const { team, uid, name, lastTime, tagID } = noteInfo;
  const date = useMemo(() => dayjs(lastTime).calendar(), [lastTime]);
  const href = `${team ? "team" : "reader"}/${uid}`;

  const [noteName, setNoteName] = useState(name);
  const nav = useNavigate();

  const saveNoteName = () => {
    const newName = noteName.trim();
    if (!newName || newName === name) return setNoteName(name);
    editNoteData(uid, { name: newName });
    setAllNotes((prev) => ({ ...prev, [uid]: { ...noteInfo, name: newName } }));
  };

  const handleClick = () => {
    if (!editing) return nav(href);
    setSelectNotes((prev) => {
      if (prev.has(uid)) return prev.delete(uid);
      return prev.add(uid);
    });
  };

  const tag = allTags[tagID];

  return (
    <div className="note-item" data-selected={selected} onClick={handleClick}>
      <div className="left">
        {timgShow && <NoteTimg uid={uid} />}
        {team && <CloudTwoTone className="cloud-icon" />}
        <CheckCircleFilled className="checked-icon" />
      </div>
      <div className="content">
        {editing && !selected ? (
          <Input
            className="name-input"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={saveNoteName}
          />
        ) : (
          <p className="name">{name}</p>
        )}
        <p className="info">
          <span className="date">{date}</span>
          {tag && currTagID === "DEFAULT" && (
            <span className="tag" style={getColorPalette(tag.color)}>
              {tag.name}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const PageWrapper = React.lazy(() => import("component/PageWrapper"));

const NoteTimg: FC<{ uid: string }> = ({ uid }) => {
  const [note, setNote] = useState<Note>();
  const [teamNote, setTeamNote] = useState<TeamPageRec>();
  useEffect(() => {
    loadNote(uid).then(setNote);
    loadCachedTeamState(uid).then(setTeamNote);
  }, [uid]);

  const firstID = note?.pageOrder[0] ?? "";
  const firstPage = note?.pageRec[firstID];

  const drawState = useMemo(() => {
    if (!firstPage) return;
    const { state, ratio } = firstPage;
    return DrawState.loadFromFlat(state, ratio);
  }, [firstPage]);
  const teamStateMap = useMemo(() => {
    if (!teamNote || !firstID) return;
    return TeamState.createFromTeamPages(teamNote).getOnePageStateMap(firstID);
  }, [teamNote, firstID]);

  if (!firstPage || !drawState) return null;
  const { ratio, image } = firstPage;
  return (
    <div className="timg-wrapper" data-landscape={ratio < 1}>
      <Suspense fallback={null}>
        <PageWrapper
          drawState={drawState}
          teamStateMap={teamStateMap}
          thumbnail={image}
          preview
        />
      </Suspense>
    </div>
  );
};
