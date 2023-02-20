import {
  Button,
  ButtonProps,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  MenuProps as AntdMenuProps,
} from "antd";
import { FC } from "react";
import {
  SwapOutlined,
  TagsOutlined,
  FileOutlined,
  DeleteOutlined,
  SearchOutlined,
  SelectOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Setter } from "lib/hooks";
import { ColorCirle } from "component/ColorCircle";
import { deleteNote, moveNoteTag, NoteTag } from "lib/note/archive";
import { Set } from "immutable";
import { MenuProps } from "../Menu";
import { NoteInfo } from "lib/note/note";

export const ListTools: FC<
  {
    sortType: string;
    setSortType: Setter<string>;
    editing: boolean;
    setEditing: Setter<boolean>;
    searchText: string;
    setSearchText: Setter<string>;
    selectedNotes: Set<string>;
  } & MenuProps
> = ({
  sortType,
  setSortType,
  editing,
  setEditing,
  searchText,
  setSearchText,
  selectedNotes,
  setAllNotes,
  setAllTags,
  allTags,
}) => {
  const menu: AntdMenuProps = {
    items: [
      {
        type: "group",
        children: [
          { icon: <FileOutlined />, key: "CREATE", label: "Date created" },
          { icon: <FileTextOutlined />, key: "LAST", label: "Date modified" },
          {
            icon: <SortAscendingOutlined />,
            key: "NAME",
            label: "Name",
          },
        ],
        label: "Sort by",
        className: "sort-drop",
      },
    ],
    onClick({ key }) {
      setSortType(key);
    },
    selectedKeys: [sortType],
  };

  const btnProps: ButtonProps = { type: "text", shape: "circle" };
  const sortButton = (
    <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
      <Button
        className="sort-btn"
        icon={<SwapOutlined rotate={90} />}
        {...btnProps}
      />
    </Dropdown>
  );
  const disabled = selectedNotes.size === 0;

  const deleteNotes = async () => {
    let tags: Record<string, NoteTag> | undefined;
    let allNotes: Record<string, NoteInfo> | undefined;
    for (let uid of selectedNotes.toArray()) {
      const res = await deleteNote(uid);
      tags = res.tags;
      allNotes = res.allNotes;
    }
    tags && setAllTags(tags);
    allNotes && setAllNotes(allNotes);
  };

  const moveNotes = async (tagID: string) => {
    let tags: Record<string, NoteTag> | undefined;
    let allNotes: Record<string, NoteInfo> | undefined;
    for (let noteID of selectedNotes.toArray()) {
      const res = await moveNoteTag(noteID, tagID);
      tags = res.tags;
      allNotes = res.allNotes;
    }
    tags && setAllTags(tags);
    allNotes && setAllNotes(allNotes);
  };

  const deleteButton = (
    <Popconfirm
      title="Notes will be deleted."
      onConfirm={deleteNotes}
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
      <ColorCirle color={color} className="tag-circle" />
      <span className="name">{name}</span>
    </div>
  );

  const overlay = (
    <Menu
      onClick={({ key }) => moveNotes(key)}
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
      overlayClassName="tag-drop"
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
    <div className="list-tools" data-editing={editing}>
      {editing ? (
        <>
          <Button
            onClick={() => setEditing(false)}
            icon={<ArrowLeftOutlined />}
            {...btnProps}
          />
          {tagButton}
          {deleteButton}
        </>
      ) : (
        <>
          <Button
            onClick={() => setEditing(true)}
            icon={<SelectOutlined />}
            {...btnProps}
          />
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
