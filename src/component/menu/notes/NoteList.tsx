import { FC, useMemo, useState, useEffect, useContext } from "react";
import {
  NoteTag,
  deleteNote,
  moveNoteTag,
  editNoteData,
  loadNote,
} from "lib/note/archive";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CloudTwoTone, CheckCircleFilled } from "@ant-design/icons";
import { SwipeDelete, SwipeDeleteProvider } from "component/ui/SwipeDelete";
import { NoteInfo, NotePage } from "lib/note/note";
import { DrawState } from "lib/draw/DrawState";
import { PageWrapper } from "component/reader/Reader";
import { useNavigate } from "react-router-dom";
import calender from "dayjs/plugin/calendar";
import { MenuHeader } from "../header";
import { Setter } from "lib/hooks";
import { List, Map, Set } from "immutable";
import { MenuCtx } from "../Menu";
import { Input } from "antd";
import dayjs from "dayjs";
import { getCachedTeamState } from "lib/network/http";
import { TeamState } from "lib/draw/TeamState";
import { getColorPalette } from "lib/color";
import classNames from "classnames";
import { ListTools } from "../header/ListTools";

dayjs.extend(calender);

export const NoteList: FC<{ noteList: List<NoteInfo> }> = ({ noteList }) => {
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
    <SwipeDeleteProvider>
      <TransitionGroup className="note-list">
        <MenuHeader>
          <ListTools
            sortType={sortType}
            setSortType={setSortType}
            searchText={searchText}
            setSearchText={setSearchText}
            onDelete={() => removeNotes(selectedNotes.toArray())}
            onMove={(tagID) => moveNotes(selectedNotes.toArray(), tagID)}
            disabled={selectedNotes.size === 0}
          />
        </MenuHeader>
        {filterdList.map((noteInfo, index) => {
          const { uid } = noteInfo;
          const selected = selectedNotes.has(uid);
          const nextUid = filterdList.get(index + 1)?.uid;
          const last = (nextUid && selectedNotes.has(nextUid)) !== selected;
          return (
            <CSSTransition key={uid} timeout={300}>
              <SwipeDelete
                className={classNames("note-wrapper", { selected, last })}
                onDelete={() => removeNotes([uid])}
                disable={editing}
              >
                <NoteItem
                  noteInfo={noteInfo}
                  selected={selected}
                  setSelectNotes={setSelectNotes}
                />
              </SwipeDelete>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </SwipeDeleteProvider>
  );
};

const NoteItem: FC<{
  noteInfo: NoteInfo;
  selected: boolean;
  setSelectNotes: Setter<Set<string>>;
}> = ({ noteInfo, selected, setSelectNotes }) => {
  const { team, uid, name, lastTime, tagID } = noteInfo;
  const date = useMemo(() => dayjs(lastTime).calendar(), [lastTime]);
  const href = `${team ? "team" : "reader"}/${uid}`;

  const { editing, setAllNotes } = useContext(MenuCtx);
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

  const [firstPage, setFirstPage] = useState<NotePage>();
  const drawState = useMemo(() => {
    if (!firstPage) return;
    const { state, ratio } = firstPage;
    return DrawState.loadFromFlat(state, ratio);
  }, [firstPage]);
  const [teamStateMap, setTeamStateMap] = useState<Map<string, DrawState>>();

  useEffect(() => {
    (async () => {
      const stored = await loadNote(uid);
      if (!stored) return;
      const { pageRec, pageOrder } = stored;
      const firstID = pageOrder[0];
      if (!firstID) return;
      setFirstPage(pageRec[firstID]);
      const teamNote = await getCachedTeamState(uid);
      if (!teamNote) return;
      setTeamStateMap(
        TeamState.createFromTeamPages(teamNote).getOnePageStateMap(firstID)
      );
    })();
  }, [uid]);

  const { allTags, currTagID } = useContext(MenuCtx);
  const tag = allTags[tagID];

  const timg = (
    <div
      className="timg-wrapper"
      data-landscape={(firstPage?.ratio ?? 1.5) < 1}
    >
      {firstPage && drawState && (
        <PageWrapper
          drawState={drawState}
          teamStateMap={teamStateMap}
          thumbnail={firstPage.image}
          preview
        />
      )}
      {team && <CloudTwoTone className="cloud-icon" />}
      <CheckCircleFilled className="checked-icon" />
    </div>
  );

  return (
    <div className="note-item" data-selected={selected} onClick={handleClick}>
      {timg}
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
