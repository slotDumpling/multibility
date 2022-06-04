import { Button, Input, Modal, Popconfirm, Select } from "antd";
import { FC, MouseEventHandler, useContext, useEffect, useState } from "react";
import { deleteTag, editTag, NoteTag, addNewTag } from "../../lib/note/archive";
import { colors, getRandomColor } from "../../lib/color";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  TagOutlined,
  DeleteOutlined,
  SettingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import SwipeDelete from "../ui/SwipeDelete";
import { Setter } from "../../lib/hooks";
import classNames from "classnames";

export const TagCircle = ({ color }: { color: string }) => {
  const style = { backgroundColor: color };
  return <div className="tag-circle" style={style} />;
};

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
          <TagCircle color={c} />
        </Select.Option>
      ))}
    </Select>
  );

  return (
    <Input
      placeholder="Tag name..."
      className="tag-name-input"
      addonBefore={colorSelector}
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
    />
  );
};

const TagItem: FC<{
  noteTag: NoteTag;
  removeTag: () => void;
  onClick: MouseEventHandler<HTMLDivElement>;
}> = ({ noteTag, removeTag, onClick }) => {
  const { uid, color, name, notes } = noteTag;
  const { editing, tagUid } = useContext(MenuStateCtx);
  const { setAllTags } = useContext(MenuMethodCtx);
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);
  const [tagEditing, setTagEditing] = useState(false);
  useEffect(() => setTagEditing(false), [editing]);

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

  return (
    <div
      className={classNames("tag-item", {
        curr: tagUid === uid,
        editing: tagEditing,
      })}
      onClick={onClick}
    >
      {tagEditing || (
        <>
          <TagCircle color={tagColor} />
          <span className="tag-name">{tagName}</span>
        </>
      )}
      {editing || <span className="tag-num">{notes.length}</span>}
      {editing && !tagEditing && (
        <Button
          size="small"
          type="text"
          onClick={() => setTagEditing(true)}
          icon={<SettingOutlined />}
        />
      )}
      {tagEditing && (
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
      )}
    </div>
  );
};

const AddTag = () => {
  const { setAllTags } = useContext(MenuMethodCtx);
  const [modalShow, setModalShow] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(getRandomColor());

  const addTag = () => {
    const name = tagName.trim();
    if (!name) return;
    addNewTag(name, tagColor).then(setAllTags);
    setModalShow(false);
  };

  useEffect(() => {
    setTagName("");
    setTagColor(getRandomColor());
  }, [modalShow]);

  return (
    <>
      <Button
        shape="round"
        icon={<TagOutlined />}
        onClick={() => setModalShow(true)}
      >
        Add
      </Button>
      <Modal
        visible={modalShow}
        onCancel={() => setModalShow(false)}
        title="Add a new tag"
        width={400}
        onOk={addTag}
        destroyOnClose
      >
        <TagInput
          tagName={tagName}
          setTagName={setTagName}
          tagColor={tagColor}
          setTagColor={setTagColor}
        />
      </Modal>
    </>
  );
};

export default function SideMenu({ onSelect }: { onSelect?: () => void }) {
  const { allTags, editing, tagUid, allNotes } = useContext(MenuStateCtx);
  const { setTagUid, setAllTags } = useContext(MenuMethodCtx);
  const { setEditing } = useContext(MenuMethodCtx);
  const [nowSwiped, setNowSwiped] = useState("");

  async function removeOneTag(uid: string) {
    const tags = await deleteTag(uid);
    setTagUid("DEFAULT");
    setAllTags(tags);
  }

  const selectTag = (key: string) => {
    setTagUid(key);
    onSelect && onSelect();
  };

  const allNoteTag = (
    <div className="tag-wrapper">
      <div
        className={classNames("tag-item", { curr: tagUid === "DEFAULT" })}
        onClick={() => selectTag("DEFAULT")}
      >
        <ProfileOutlined className="all-note-icon" />
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
        {Object.values(allTags).map((tag) => {
          const { uid } = tag;
          const removeTag = () => removeOneTag(uid);
          return (
            <div className="tag-wrapper" key={uid}>
              <SwipeDelete
                uid={uid}
                onDelete={removeTag}
                nowSwiped={nowSwiped}
                setNowSwiped={setNowSwiped}
                disable={editing}
              >
                <TagItem
                  noteTag={tag}
                  removeTag={removeTag}
                  onClick={() => selectTag(uid)}
                />
              </SwipeDelete>
            </div>
          );
        })}
      </div>
      <footer>
        <AddTag />
        {editButton}
      </footer>
    </aside>
  );
}
