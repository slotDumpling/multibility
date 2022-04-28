import {
  FC,
  useMemo,
  useState,
  useEffect,
  useContext,
  MouseEventHandler,
} from "react";
import {
  NoteTag,
  deleteNote,
  moveNoteTag,
  editNoteData,
} from "../../lib/note/archive";
import {
  SwapOutlined,
  TagsOutlined,
  EditOutlined,
  CloudOutlined,
  CloseOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Tag, Dropdown, Menu, Radio } from "antd";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import { NoteInfo } from "../../lib/note/note";
import { useNavigate } from "react-router-dom";
import SwipeDelete from "../ui/SwipeDelete";
import dafaultImg from "../ui/default.png";
import { TagCircle } from "./SideMenu";
import classNames from "classnames";
import { Set } from "immutable";
import moment from "moment";
import { Setter } from "../../lib/hooks";

export default function NoteList({ noteList }: { noteList: NoteInfo[] }) {
  const [nowSwiped, setNowSwiped] = useState("");
  const { editing } = useContext(MenuStateCtx);
  const { setAllTags, setAllNotes } = useContext(MenuMethodCtx);
  const [sortType, setSortType] = useState("LAST");
  const [searchText, setSearchText] = useState("");
  const [selectedNotes, setSelectNotes] = useState(Set<string>());
  const nav = useNavigate();

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
        return noteList
          .sort((n0, n1) => -n0.createTime + n1.createTime)
          .slice();
      case "LAST":
        return noteList.sort((n0, n1) => -n0.lastTime + n1.lastTime).slice();
      case "NAME":
        return noteList
          .sort((n0, n1) => n0.name.localeCompare(n1.name))
          .slice();
      default:
        return noteList.slice();
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
    <div className="note-list">
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
        const { uid, team } = noteInfo;
        const removeNote = () => removeNotes([uid]);
        const href = `${team ? "team" : "reader"}/${uid}`;
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
              onClick={(e) => {
                if (e.target instanceof HTMLInputElement) return;
                if (!editing) return nav(href);
                setSelectNotes((prev) => {
                  if (prev.has(uid)) return prev.delete(uid);
                  else return prev.add(uid);
                });
              }}
              selected={selectedNotes.has(uid)}
            />
          </SwipeDelete>
        );
      })}
    </div>
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
  const { Item } = Menu;
  const { editing, allTags } = useContext(MenuStateCtx);

  const sortMenu = (
    <Menu onClick={({ key }) => setSortType(key)} selectedKeys={[sortType]}>
      <Item icon={<ClockCircleOutlined />} key="CREATE">
        Created Time
      </Item>
      <Item icon={<EditOutlined />} key="LAST">
        Modified Time
      </Item>
      <Item icon={<SortAscendingOutlined />} key="NAME">
        Name
      </Item>
    </Menu>
  );

  const sortButton = (
    <Dropdown overlay={sortMenu} trigger={["click"]}>
      <Button
        className="sort-btn"
        icon={<SwapOutlined rotate={90} />}
        size="small"
      />
    </Dropdown>
  );

  const deleteButton = (
    <Popconfirm
      title="Notes will be deleted."
      onConfirm={onDelete}
      icon={<DeleteOutlined />}
      cancelText="Cancel"
      placement="bottom"
      okText="Delete"
      okType="danger"
      okButtonProps={{ type: "primary" }}
    >
      <Button
        className="del-btn"
        size="small"
        danger
        icon={<DeleteOutlined />}
        disabled={disabled}
      >
        Delete
      </Button>
    </Popconfirm>
  );

  const overlay = (
    <Menu onClick={({ key }) => onMove(key)}>
      <Item key="DEFAULT">
        <div className="tag-select">
          <CloseOutlined className="none-tag-icon" />
          <span>No Tag</span>
        </div>
      </Item>
      {Object.values(allTags).map((t) => (
        <Item key={t.uid}>
          <div className="tag-select">
            <TagCircle color={t.color} />
            <span>{t.name}</span>
          </div>
        </Item>
      ))}
    </Menu>
  );

  const tagButton = (
    <Dropdown
      disabled={disabled}
      overlay={overlay}
      trigger={["click"]}
      placement="bottom"
    >
      <Button className="tag-btn" size="small" icon={<TagsOutlined />}>
        Tag
      </Button>
    </Dropdown>
  );

  return (
    <div className="head-tools">
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
            size="small"
            className="search-input"
            prefix={<SearchOutlined />}
            allowClear
          />
          <Radio.Group value="LIST" size="small" className="radio">
            <Radio.Button value="LIST">
              <UnorderedListOutlined />
            </Radio.Button>
            <Radio.Button value="GRID" disabled>
              <AppstoreOutlined />
            </Radio.Button>
          </Radio.Group>
          {sortButton}
        </>
      )}
    </div>
  );
};

const NoteItem: FC<{
  noteInfo: NoteInfo;
  onClick: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}> = ({ noteInfo, onClick, selected }) => {
  const { team, uid, name, thumbnail, lastTime } = noteInfo;

  const { editing } = useContext(MenuStateCtx);
  const { setAllNotes } = useContext(MenuMethodCtx);
  const [noteName, setNoteName] = useState(name);

  const saveNoteName = () => {
    const newName = noteName.trim();
    if (!newName || newName === name) return setNoteName(name);
    editNoteData(uid, { name: newName });
    setAllNotes((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], name: newName },
    }));
  };

  return (
    <div className={classNames("note-item", { selected })} onClick={onClick}>
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
            onBlur={saveNoteName}
          />
        )}
        <p className="date">{moment(lastTime).calendar()}</p>
      </div>
    </div>
  );
};
