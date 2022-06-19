import { FC, useContext, useEffect, useState } from "react";
import {
  TagOutlined,
  DeleteOutlined,
  SettingOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { deleteTag, editTag, NoteTag, addNewTag } from "../../lib/note/archive";
import { SwipeDelete, SwipeDeleteContext } from "../ui/SwipeDelete";
import { Button, Input, Popconfirm, Select } from "antd";
import { colors, getRandomColor } from "../../lib/color";
import { MenuCtx } from "./MainMenu";
import { ColorCirle } from "../widgets/ColorCircle";
import { Setter } from "../../lib/hooks";
import classNames from "classnames";

const TagInput: FC<{
  tagName: string;
  setTagName: Setter<string>;
  tagColor: string;
  setTagColor: Setter<string>;
}> = ({ tagName, setTagName, tagColor, setTagColor }) => {
  const colorSelector = (
    <Select value={tagColor} onSelect={setTagColor} listHeight={150}>
      {colors.map((c) => (
        <Select.Option value={c} key={c}>
          <ColorCirle className="tag-circle" color={c} />
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <Input
      autoFocus
      placeholder="Tag name..."
      className="tag-name-input"
      addonBefore={colorSelector}
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
    />
  );
};

const TagItem: FC<{ noteTag: NoteTag }> = ({ noteTag }) => {
  const { uid, color, name, notes } = noteTag;
  const { editing, tagUid, setAllTags, setTagUid } = useContext(MenuCtx);
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);
  const [tagEditing, setTagEditing] = useState(false);
  useEffect(() => setTagEditing(false), [editing]);

  async function removeTag() {
    const tags = await deleteTag(uid);
    setTagUid("DEFAULT");
    setAllTags(tags);
  }

  const cancelEditing = () => {
    setTagName(name);
    setTagColor(color);
    setTagEditing(false);
  };

  const finishEditing = async () => {
    const newTag: NoteTag = {
      ...noteTag,
      name: tagName,
      color: tagColor,
    };

    const newAllTags = await editTag(newTag);
    setAllTags(newAllTags);
    setTagEditing(false);
  };

  const displayPanel = (
    <>
      <ColorCirle className="tag-circle" color={tagColor} />
      <span className="tag-name">{tagName}</span>
      {editing || <span className="tag-num">{notes.length}</span>}
      {editing && (
        <Button
          size="small"
          type="text"
          onClick={() => setTagEditing(true)}
          icon={<SettingOutlined />}
        />
      )}
    </>
  );

  const editingPanel = (
    <>
      <TagInput
        tagName={tagName}
        setTagName={setTagName}
        tagColor={tagColor}
        setTagColor={setTagColor}
      />
      <div className="buttons">
        <Popconfirm
          title="This tag will be deleted."
          onConfirm={removeTag}
          placement="left"
          cancelText="Cancel"
          icon={<DeleteOutlined />}
          okText="Delete"
          okType="danger"
          okButtonProps={{ type: "primary" }}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
        <Button onClick={cancelEditing}>Cancel</Button>
        <Button type="primary" disabled={!tagName} onClick={finishEditing}>
          OK
        </Button>
      </div>
    </>
  );

  const itemClass = classNames("tag-item", {
    curr: tagUid === uid,
    editing: tagEditing,
  });

  return (
    <SwipeDelete className="tag-wrapper" onDelete={removeTag} disable={editing}>
      <div className={itemClass} onClick={() => setTagUid(uid)}>
        {tagEditing ? editingPanel : displayPanel}
      </div>
    </SwipeDelete>
  );
};

const NewTagItem: FC<{ setAdding: Setter<boolean> }> = ({ setAdding }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(getRandomColor());
  const { setAllTags } = useContext(MenuCtx);

  const addTag = () => {
    const name = tagName.trim();
    if (!name) return;
    addNewTag(name, tagColor).then(setAllTags);
    setAdding(false);
  };

  return (
    <div className="tag-wrapper new">
      <div className="tag-item curr editing">
        <TagInput
          tagName={tagName}
          setTagName={setTagName}
          tagColor={tagColor}
          setTagColor={setTagColor}
        />
        <div className="buttons">
          <Button onClick={() => setAdding(false)}>Cancel</Button>
          <Button type="primary" disabled={!tagName} onClick={addTag}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function SideMenu() {
  const { allTags, editing, tagUid, allNotes, setTagUid, setEditing } =
    useContext(MenuCtx);
  const [adding, setAdding] = useState(false);

  const allNoteTag = (
    <div className="tag-wrapper">
      <div
        className={classNames("tag-item", { curr: tagUid === "DEFAULT" })}
        onClick={() => setTagUid("DEFAULT")}
      >
        <ContainerOutlined className="all-note-icon" />
        <span className="tag-name">All Notes</span>
        <span className="tag-num">{Object.keys(allNotes).length}</span>
      </div>
    </div>
  );

  const swichEditing = () => setEditing((prev) => !prev);

  const editButton = (
    <Button
      className="edit-btn small"
      shape="round"
      type={editing ? "primary" : "default"}
      onClick={swichEditing}
    >
      {editing ? "Done" : "Edit"}
    </Button>
  );

  return (
    <aside className="side-menu">
      <div className="tag-list">
        {allNoteTag}
        <SwipeDeleteContext>
          {Object.values(allTags).map((tag) => (
            <TagItem key={tag.uid} noteTag={tag} />
          ))}
        </SwipeDeleteContext>
        {adding && <NewTagItem setAdding={setAdding} />}
      </div>
      <footer>
        <Button
          shape="round"
          icon={<TagOutlined />}
          onClick={() => setAdding(true)}
          disabled={adding}
        >
          Add
        </Button>
        {editButton}
      </footer>
    </aside>
  );
}
