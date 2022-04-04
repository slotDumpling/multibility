import { Button, Input, Menu, Popconfirm, Popover, Select } from "antd";
import { useContext, useState } from "react";
import { deleteTag, editTag, NoteTag, storeTag } from "../../lib/note/archive";
import { colors } from "../../lib/color";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  TagOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  ProfileOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import Search from "antd/lib/input/Search";

export const TagCircle = ({ color }: { color: string }) => {
  const style = { backgroundColor: color };
  return <div className="tag-circle" style={style} />;
};

function TagItem({ noteTag }: { noteTag: NoteTag }) {
  const { uid, color, name, notes } = noteTag;
  const { editing } = useContext(MenuStateCtx);
  const { setTagUid, setAllTags } = useContext(MenuMethodCtx);
  const [tagEditing, setTagEditing] = useState(false);
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);

  function cancelEditing() {
    setTagName(name);
    setTagColor(color);
    setTagEditing(false);
  }

  async function removeTag() {
    const tags = await deleteTag(uid);
    setTagUid("DEFAULT");
    setAllTags(tags);
  }

  async function finishEditing() {
    const newTag: NoteTag = {
      uid,
      name: tagName,
      color: tagColor,
      notes: notes,
    };

    const newAllTags = await editTag(newTag);
    setAllTags(newAllTags);
    setTagEditing(false);
  }

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
          <span className="tag-name">{tagName}</span>
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
  const { setAllTags } = useContext(MenuMethodCtx);

  async function addTag(val: string) {
    const name = val.trim();
    if (!name) {
      return;
    } else {
      const tags = await storeTag(name);
      setAllTags(tags);
    }
  }

  const popContent = (
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
        content={popContent}
        trigger="click"
        placement="topLeft"
        destroyTooltipOnHide
      >
        <Button shape="circle" type="text" icon={<TagOutlined />} />
      </Popover>
    </div>
  );
};

export default function SideMenu() {
  const { allTags } = useContext(MenuStateCtx);
  const { setTagUid } = useContext(MenuMethodCtx);

  function menuClicked({ key }: { key: string }) {
    setTagUid(key);
  }

  const { Item } = Menu;

  return (
    <aside>
      <input type="checkbox" id="aside-checkbox" />
      <div className="side-wrapper">
        <Menu
          onClick={menuClicked}
          className="side-menu"
          defaultSelectedKeys={["DEFAULT"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <Item key="DEFAULT">
            <div className="menu-item">
              <ProfileOutlined id="all-note-icon" />
              <span className="tag-name">All Notes</span>
            </div>
          </Item>
          {Object.values(allTags).map((tag) => (
            <Item key={tag.uid}>
              <TagItem noteTag={tag} />
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
