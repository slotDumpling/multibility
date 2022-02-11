import { Button, Input } from "antd";
import { useContext, useState } from "react";
import { storeTag } from "../../lib/note/archive";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {
  CheckOutlined,
  CloseOutlined,
  TagOutlined,
} from "@ant-design/icons";

export default function LeftTools() {
  const [adding, setAdding] = useState(false);
  const [tagName, setTagName] = useState("");
  const { editing } = useContext(MenuStateCtx);
  const { setAllTags, setTagList, setEditing } = useContext(MenuStateUpdateCtx);

  async function addTag() {
    const name = tagName.trim();
    if (!name) {
      return;
    } else {
      const [tags, tagList] = await storeTag(name);
      setAllTags(tags);
      setTagList(tagList);
      setAdding(false);
      setTagName("");
    }
  }

  function cancelAdding() {
    setTagName("");
    setAdding(false);
  }

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  return (
    <div id="left-tools">
      <span id="edit-button">
        <Button
          onClick={swichEditing}
          type={editing ? "primary" : "text"}
          block
        >
          {editing ? "Done" : "Edit"}
        </Button>
      </span>
      {adding ? (
        <>
          <Input
            placeholder="Tag name..."
            style={{ width: 150 }}
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
      ) : (
        <Button
          type="text"
          onClick={() => void setAdding(true)}
          icon={<TagOutlined />}
        />
      )}
    </div>
  );
}