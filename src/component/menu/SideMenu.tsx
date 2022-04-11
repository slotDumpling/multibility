import { Button, Input, Popconfirm, Popover, Select } from "antd";
import { FC, MouseEventHandler, useContext, useEffect, useState } from "react";
import { deleteTag, editTag, NoteTag, storeTag } from "../../lib/note/archive";
import { colors } from "../../lib/color";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  TagOutlined,
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import SwipeDelete from "../ui/SwipeDelete";
import classNames from "classnames";

export const TagCircle = ({ color }: { color: string }) => {
  const style = { backgroundColor: color };
  return <div className="tag-circle" style={style} />;
};

const TagItem: FC<{
  noteTag: NoteTag;
  removeTag: () => void;
  onClick: MouseEventHandler<HTMLDivElement>;
}> = ({ noteTag, removeTag, onClick }) => {
  const { uid, color, name, notes } = noteTag;
  const { editing, tagUid } = useContext(MenuStateCtx);
  const { setAllTags } = useContext(MenuMethodCtx);
  const [tagEditing, setTagEditing] = useState(false);
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);

  const cancelEditing = () => {
    setTagName(name);
    setTagColor(color);
    setTagEditing(false);
  };

  const finishEditing = async () => {
    const newTag: NoteTag = {
      uid,
      name: tagName,
      color: tagColor,
      notes: notes,
    };

    const newAllTags = await editTag(newTag);
    setAllTags(newAllTags);
    setTagEditing(false);
  };

  const colorSelector = (
    <Select value={tagColor} onSelect={setTagColor}>
      {colors.map((c) => (
        <Select.Option value={c} key={c}>
          <TagCircle color={c} />
        </Select.Option>
      ))}
    </Select>
  );

  const TagNameInput = (
    <Input
      className="tag-name-input"
      addonBefore={colorSelector}
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
    />
  );

  useEffect(() => {
    setTagEditing(false);
  }, [editing])

  return (
    <div
      className={classNames("menu-item", {
        curr: tagUid === uid,
        editing: editing && tagEditing,
      })}
      onClick={onClick}
    >
      {editing && tagEditing ? (
        TagNameInput
      ) : (
        <>
          <TagCircle color={tagColor} />
          <span className="tag-name">{tagName}</span>
        </>
      )}
      {editing && tagEditing && (
        <div className="buttons">
          <Popconfirm
            title="This tag will be deleted."
            onConfirm={removeTag}
            placement="left"
            cancelText="Cancel"
            icon={<DeleteOutlined />}
            okText="Delete"
            okType="danger"
            okButtonProps={{type: 'primary'}}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Button onClick={cancelEditing}>Cancel</Button>
          <Button
            disabled={tagName === ""}
            type="primary"
            onClick={finishEditing}
          >
            OK
          </Button>
        </div>
      )}
      {editing && !tagEditing && (
        <Button
          size="small"
          type="text"
          onClick={() => setTagEditing(true)}
          icon={<SettingOutlined />}
        />
      )}
    </div>
  );
};

const AddTag = () => {
  const { setAllTags } = useContext(MenuMethodCtx);
  const [popShow, setPopShow] = useState(false);

  async function addTag(val: string) {
    const name = val.trim();
    if (!name) {
      return;
    } else {
      const tags = await storeTag(name);
      setAllTags(tags);
      setPopShow(false);
    }
  }

  const AddTagInput = () => (
    <Search
      placeholder="Tag name..."
      onSearch={addTag}
      allowClear
      enterButton={<PlusOutlined />}
    />
  );

  return (
    <div id="add-tag">
      <Popover
        visible={popShow}
        onVisibleChange={setPopShow}
        content={<AddTagInput />}
        trigger="click"
        placement="topLeft"
        destroyTooltipOnHide
      >
        <Button
          shape="circle"
          type="text"
          icon={<TagOutlined />}
          onClick={() => setPopShow(true)}
        />
      </Popover>
    </div>
  );
};

export default function SideMenu() {
  const { allTags, editing, tagUid } = useContext(MenuStateCtx);
  const { setTagUid, setAllTags } = useContext(MenuMethodCtx);
  const [nowSwiped, setNowSwiped] = useState("");

  useEffect(() => {
    if (editing) setNowSwiped("");
  }, [editing]);

  async function removeOneTag(uid: string) {
    const tags = await deleteTag(uid);
    setTagUid("DEFAULT");
    setAllTags(tags);
  }

  return (
    <aside>
      <input type="checkbox" id="aside-checkbox" />
      <div className="side-wrapper">
        <div className="side-menu">
          <div
            className={classNames("menu-item", { curr: tagUid === "DEFAULT" })}
            onClick={() => setTagUid("DEFAULT")}
          >
            <ProfileOutlined id="all-note-icon" />
            <span className="tag-name">All Notes</span>
          </div>
          {Object.values(allTags).map((tag) => {
            const { uid } = tag;
            const removeTag = () => removeOneTag(uid);
            return (
              <SwipeDelete
                key={uid}
                uid={uid}
                onDelete={removeTag}
                nowSwiped={nowSwiped}
                setNowSwiped={setNowSwiped}
                disable={editing}
                icon
              >
                <TagItem
                  noteTag={tag}
                  removeTag={removeTag}
                  onClick={() => setTagUid(uid)}
                />
              </SwipeDelete>
            );
          })}
        </div>
        <footer>
          <AddTag />
        </footer>
      </div>
    </aside>
  );
}
