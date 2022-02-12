import { Button, Input, Menu, Popconfirm, Popover, Select } from "antd";
import { useContext, useState } from "react";
import { deleteTag, editTag, NoteTag, storeTag } from "../../lib/note/archive";
import { colors } from "../ui/color";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {
  MinusCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  MenuOutlined,
  ProfileOutlined,
  TagOutlined,
} from "@ant-design/icons";

function TagItem({ uid }: { uid: string }) {
  const { editing, allTags } = useContext(MenuStateCtx);
  const { setTagUid, setTagList, setAllTags } = useContext(MenuStateUpdateCtx);
  const tag = allTags[uid];
  const [tagEditing, setTagEditing] = useState(false);
  const [tagName, setTagName] = useState(tag?.name ?? "");
  const [tagColor, setTagColor] = useState(tag?.color ?? "");

  if (!tag) return <></>;

  function cancelEditing() {
    setTagName(tag.name);
    setTagColor(tag.color);
    setTagEditing(false);
  }

  async function removeTag() {
    const [newAllTags, newTagList] = await deleteTag(uid);
    setTagUid("DEFAULT");
    setTagList(newTagList);
    setAllTags(newAllTags);
  }

  async function finishEditing() {
    const newTag: NoteTag = {
      uid,
      name: tagName,
      color: tagColor,
      notes: tag.notes,
    };

    const newAllTags = await editTag(newTag);
    setAllTags(newAllTags);
    setTagEditing(false);
  }

  const TagCircle = ({ color }: { color: string }) => {
    const style = { backgroundColor: color };
    return <div className="tag-circle" style={style} />;
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

  const TagNameInput = () => (
    <Input
      size="small"
      className="tag-name-input"
      addonBefore={colorSelector}
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
    />
  );

  return (
    <div className="menu-item">
      {editing && tagEditing ? (
        <>
          <Popconfirm
            title="Delete this tag?"
            onConfirm={removeTag}
            placement="left"
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<MinusCircleOutlined />}
            />
          </Popconfirm>
          <TagNameInput />
        </>
      ) : (
        <>
          <TagCircle color={tagColor} />
          <span>{tagName}</span>
        </>
      )}
      {editing && tagEditing && (
        <>
          <Button
            disabled={tagName === ""}
            size="small"
            type="link"
            onClick={finishEditing}
            icon={<CheckOutlined />}
          />
          <Button
            size="small"
            type="text"
            onClick={cancelEditing}
            icon={<CloseOutlined />}
          />
        </>
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
}

const AddTag = () => {
  const [tagName, setTagName] = useState("");
  const { setAllTags, setTagList } = useContext(MenuStateUpdateCtx);

  async function addTag() {
    const name = tagName.trim();
    if (!name) {
      return;
    } else {
      const [tags, tagList] = await storeTag(name);
      setAllTags(tags);
      setTagList(tagList);
      setTagName("");
    }
  }

  function cancelAdding() {
    setTagName("");
  }

  const popContent = (
    <>
      <Input
        placeholder="Tag name..."
        id="tag-input"
        value={tagName}
        onChange={(e) => {
          setTagName(e.target.value);
        }}
      />
      <Button
        disabled={tagName === "" ? true : false}
        type="link"
        size="small"
        onClick={addTag}
        icon={<CheckOutlined />}
      />
      <Button
        type="text"
        size="small"
        onClick={cancelAdding}
        icon={<CloseOutlined />}
      />
    </>
  );

  return (
    <div id="add-tag">
      <Popover content={popContent} trigger="click" placement="topLeft">
        <Button type="text" icon={<TagOutlined />} />
      </Popover>
    </div>
  );
};

export default function SideMenu() {
  const { tagList } = useContext(MenuStateCtx);
  const { setTagUid } = useContext(MenuStateUpdateCtx);

  function menuClicked({ key }: { key: string }) {
    setTagUid(key);
  }

  const { Item } = Menu;

  return (
    <aside>
      <label htmlFor="aside-checkbox" id="aside-label">
        <MenuOutlined />
      </label>
      <input type="checkbox" id="aside-checkbox" />
      <div id="side-wrapper">
        <Menu
          onClick={menuClicked}
          id="side-menu"
          defaultSelectedKeys={["DEFAULT"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <Item key={"DEFAULT"}>
            <ProfileOutlined id="all-note-icon" />
            <span>All Notes</span>
          </Item>
          {tagList.map((uid) => (
            <Item key={uid}>
              <TagItem uid={uid} />
            </Item>
          ))}
        </Menu>
        <footer>
          <AddTag />
        </footer>
      </div>
    </aside>
  );
}
