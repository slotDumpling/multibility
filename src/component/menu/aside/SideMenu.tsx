import { FC, useContext, useEffect, useState } from "react";
import {
  TagOutlined,
  DeleteOutlined,
  SettingOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import {
  deleteTag,
  editTag,
  NoteTag,
  addNewTag,
} from "../../../lib/note/archive";
import { SwipeDelete, SwipeDeleteProvider } from "../../ui/SwipeDelete";
import { Button, Input, Popconfirm, Select } from "antd";
import { colors, getColorPalette, getRandomColor } from "../../../lib/color";
import { ColorCirle } from "../../widgets/ColorCircle";
import { MenuCtx } from "../Menu";
import { Setter } from "../../../lib/hooks";

const TagInput: FC<{
  tagName: string;
  setTagName: Setter<string>;
  tagColor: string;
  setTagColor: Setter<string>;
}> = ({ tagName, setTagName, tagColor, setTagColor }) => {
  const colorSelector = (
    <Select
      value={tagColor}
      onSelect={setTagColor}
      listHeight={150}
      virtual={false}
    >
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
  const { editing, currTagID, setAllTags, setCurrTagID } = useContext(MenuCtx);
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);
  const [tagEditing, setTagEditing] = useState(false);
  useEffect(() => setTagEditing(false), [editing]);

  async function removeTag() {
    const tags = await deleteTag(uid);
    setCurrTagID("DEFAULT");
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

  return (
    <SwipeDelete className="tag-wrapper" onDelete={removeTag} disable={editing}>
      <div
        className="tag-item"
        data-curr={currTagID === uid}
        data-editing={tagEditing}
        onClick={() => setCurrTagID(uid)}
        style={getColorPalette(color)}
      >
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
    <div className="tag-wrapper">
      <div className="tag-item" data-curr data-editing>
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

export const SideMenu = () => {
  const { allTags, editing, currTagID, allNotes, setCurrTagID, setEditing } =
    useContext(MenuCtx);
  const [adding, setAdding] = useState(false);

  const allNoteTag = (
    <div className="tag-wrapper">
      <div
        className="tag-item"
        data-curr={currTagID === "DEFAULT"}
        onClick={() => setCurrTagID("DEFAULT")}
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
      className="edit-btn"
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
        <SwipeDeleteProvider>
          {Object.values(allTags).map((tag) => (
            <TagItem key={tag.uid} noteTag={tag} />
          ))}
        </SwipeDeleteProvider>
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
};
