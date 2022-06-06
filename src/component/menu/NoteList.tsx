import { FC, useMemo, useState, useEffect, useContext } from "react";
import {
  NoteTag,
  deleteNote,
  moveNoteTag,
  editNoteData,
} from "../../lib/note/archive";
import {
  SwapOutlined,
  TagsOutlined,
  FileOutlined,
  CloudOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Tag, Dropdown, Menu } from "antd";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import { NoteInfo } from "../../lib/note/note";
import { useNavigate } from "react-router-dom";
import SwipeDelete from "../ui/SwipeDelete";
import dafaultImg from "../ui/default.png";
import { Setter } from "../../lib/hooks";
import { TagCircle } from "./SideMenu";
import { List, Set } from "immutable";
import classNames from "classnames";
import moment from "moment";

export default function NoteList({ noteList }: { noteList: List<NoteInfo> }) {
  const [nowSwiped, setNowSwiped] = useState("");
  const { editing } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);
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
    switch (sortType) {
      case "CREATE":
        return noteList.sortBy((n) => -n.createTime);
      case "LAST":
        return noteList.sortBy((n) => -n.lastTime);
      case "NAME":
        return noteList.sortBy((n) => n.name.toUpperCase());
      default:
        return noteList;
    }
  }, [noteList, sortType]);

  const filterdList = useMemo(
    () =>
      sortedList.filter((n) =>
        n.name.toLowerCase().includes(searchText.trim().toLowerCase())
      ),
    [searchText, sortedList]
  );

  useEffect(() => {
    setSearchText("");
    setSelectNotes(Set());
  }, [noteList, editing]);

  return (
    <section className="note-list">
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
          <SwipeDelete
            onDelete={removeNote}
            nowSwiped={nowSwiped}
            setNowSwiped={setNowSwiped}
            disable={editing}
            uid={uid}
            key={uid}
          >
            <NoteItem
              noteInfo={noteInfo}
              selected={selectedNotes.has(uid)}
              setSelectNotes={setSelectNotes}
            />
          </SwipeDelete>
        );
      })}
    </section>
  );
}

const HeadTools: FC<{
  sortType: string;
  setSortType: Setter<string>;
  searchText: string;
  setSearchText: Setter<string>;
  onDelete: () => void;
  onMove: (tagID: string) => void;
  disabled: boolean;
}> = ({
  sortType,
  setSortType,
  searchText,
  setSearchText,
  onDelete,
  onMove,
  disabled = true,
}) => {
  const { editing, allTags } = useContext(MenuStateCtx);

  const sortMenu = (
    <Menu
      onClick={({ key }) => setSortType(key)}
      selectedKeys={[sortType]}
      items={[
        { icon: <FileOutlined />, key: "CREATE", label: "Time created" },
        { icon: <FileTextOutlined />, key: "LAST", label: "Time modified" },
        { icon: <SortAscendingOutlined />, key: "NAME", label: "Name" },
      ]}
    />
  );

  const sortButton = (
    <Dropdown overlay={sortMenu} trigger={["click"]} placement="bottom">
      <Button
        className="sort-btn"
        type="text"
        shape="circle"
        icon={<SwapOutlined rotate={90} />}
      />
    </Dropdown>
  );

  const deleteButton = (
    <Popconfirm
      title="Notes will be deleted."
      onConfirm={onDelete}
      icon={<DeleteOutlined />}
      placement="bottom"
      cancelText="Cancel"
      disabled={disabled}
      okText="Delete"
      okType="danger"
      okButtonProps={{ type: "primary" }}
    >
      <Button
        className="del-btn"
        shape="round"
        type="text"
        disabled={disabled}
        danger={!disabled}
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>
    </Popconfirm>
  );

  const ColorLabel: FC<{
    color: string;
    name: string;
  }> = ({ color, name }) => (
    <div className="tag-select">
      <TagCircle color={color} />
      <span className="name">{name}</span>
    </div>
  );

  const overlay = (
    <Menu
      onClick={({ key }) => onMove(key)}
      items={[
        {
          key: "DEFAULT",
          label: <ColorLabel color="#eee" name="No tag" />,
        },
        ...Object.values(allTags).map((t) => ({
          key: t.uid,
          label: <ColorLabel color={t.color} name={t.name} />,
        })),
      ]}
    />
  );

  const tagButton = (
    <Dropdown
      disabled={disabled}
      overlay={overlay}
      trigger={["click"]}
      placement="bottom"
    >
      <Button
        shape="round"
        type="text"
        className="tag-btn"
        icon={<TagsOutlined />}
        style={{ transition: "none" }}
      >
        Tag
      </Button>
    </Dropdown>
  );

  return (
    <div className={classNames("head-tools", { editing })}>
      {editing ? (
        <>
          {tagButton}
          {deleteButton}
        </>
      ) : (
        <>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            prefix={<SearchOutlined />}
            bordered={false}
            allowClear
          />
          {sortButton}
        </>
      )}
    </div>
  );
};

const NoteItem: FC<{
  noteInfo: NoteInfo;
  selected: boolean;
  setSelectNotes: Setter<Set<string>>;
}> = ({ noteInfo, selected, setSelectNotes }) => {
  const { team, uid, name, thumbnail, lastTime } = noteInfo;
  const date = useMemo(() => moment(lastTime).calendar(), [lastTime]);
  const href = `${team ? "team" : "reader"}/${uid}`;

  const { editing } = useContext(MenuStateCtx);
  const { setAllNotes } = useContext(MenuMethodCtx);
  const [noteName, setNoteName] = useState(name);
  const [loaded, setLoaded] = useState(false);
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
      className={classNames("note-item", { selected, loaded })}
      onClick={handleClick}
      onAnimationEnd={() => setLoaded(true)}
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
        <p className="date">{date}</p>
      </div>
    </div>
  );
};
