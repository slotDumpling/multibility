import { FC, useEffect, useState } from "react";
import {
  MenuOutlined,
  PlusOutlined,
  DeleteOutlined,
  GithubOutlined,
  SettingOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Select } from "antd";
import { deleteTag, editTag, NoteTag, addNewTag } from "lib/note/archive";
import { colors, getColorPalette, getRandomColor } from "lib/color";
import { Setter, useAsideOpen } from "lib/hooks";
import { SwipeDelete, SwipeDeleteProvider } from "component/SwipeDelete";
import { ColorCirle } from "component/ColorCircle";
import { MenuProps } from "../Menu";
import IconFont from "component/IconFont";

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
      dropdownClassName="tag-color-drop"
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
      placeholder="Tag name..."
      className="tag-name-input"
      addonBefore={colorSelector}
      value={tagName}
      onChange={(e) => setTagName(e.target.value)}
    />
  );
};

const TagItem: FC<{ noteTag: NoteTag } & MenuProps> = ({
  noteTag,
  currTagID,
  setAllTags,
  setCurrTagID,
}) => {
  const { uid, color, name, notes } = noteTag;
  const [tagName, setTagName] = useState(name);
  const [tagColor, setTagColor] = useState(color);
  const [tagEditing, setTagEditing] = useState(false);
  const curr = currTagID === uid;
  useEffect(() => setTagEditing(false), [curr]);

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
      {curr ? (
        <Button
          size="small"
          type="text"
          onClick={() => setTagEditing(true)}
          icon={<SettingOutlined />}
        />
      ) : (
        <span className="tag-num">{notes.length}</span>
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
    <SwipeDelete
      className="tag-wrapper"
      onDelete={removeTag}
      disable={tagEditing}
    >
      <div
        className="tag-item"
        data-curr={curr}
        data-editing={tagEditing}
        onClick={() => setCurrTagID(uid)}
        style={getColorPalette(color)}
      >
        {tagEditing ? editingPanel : displayPanel}
      </div>
    </SwipeDelete>
  );
};

const NewTagItem: FC<{ setAdding: Setter<boolean> } & MenuProps> = ({
  setAdding,
  setAllTags,
}) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(getRandomColor());

  const addTag = () => {
    const name = tagName.trim();
    if (!name) return;
    addNewTag(name, tagColor).then(setAllTags);
    setAdding(false);
  };

  return (
    <div className="tag-wrapper">
      <div className="tag-item" data-editing>
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

export const SideMenu: FC<MenuProps> = (props) => {
  const { allTags, currTagID, allNotes, setCurrTagID } = props;
  const [adding, setAdding] = useState(false);
  const [asideOpen, setAsideOpen] = useAsideOpen();

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

  const header = (
    <header>
      <Button
        className="aside-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setAsideOpen(false)}
      />
      <h2 className="logo">Multibility</h2>
      <Button
        className="new-tag-btn"
        type="text"
        icon={<PlusOutlined />}
        onClick={() => setAdding(true)}
        disabled={adding}
      />
    </header>
  );

  const footer = (
    <footer>
      <Button
        icon={<GithubOutlined />}
        href="https://github.com/slotDumpling/multibility"
        shape="round"
        size="small"
      >
        GitHub
      </Button>
      <Button
        icon={<IconFont type="icon-npm" />}
        href="https://www.npmjs.com/package/draft-pad"
        shape="round"
        size="small"
      >
        draft-pad
      </Button>
    </footer>
  );

  return (
    <aside data-open={asideOpen} onClick={() => setAsideOpen(false)}>
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        {header}
        <div className="tag-list">
          {allNoteTag}
          <SwipeDeleteProvider>
            {Object.values(allTags).map((tag) => (
              <TagItem key={tag.uid} noteTag={tag} {...props} />
            ))}
          </SwipeDeleteProvider>
          {adding && <NewTagItem setAdding={setAdding} {...props} />}
        </div>
        {footer}
      </div>
    </aside>
  );
};
