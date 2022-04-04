import { Button } from "antd";
import { useContext } from "react";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  MenuOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";

export default function LeftTools() {
  const { editing } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuMethodCtx);

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  return (
    <div className="left-tools">
      <label htmlFor="aside-checkbox" id="aside-label">
        <MenuOutlined />
      </label>
      <Button
        className="edit-btn large"
        onClick={swichEditing}
        type={editing ? "primary" : "text"}
        block
      >
        {editing ? "Done" : "Edit"}
      </Button>
      <Button
        className="edit-btn small"
        onClick={swichEditing}
        type={editing ? "primary" : "text"}
        shape="circle"
      >
        {editing ? <CheckOutlined /> : <EditOutlined />}
      </Button>
    </div>
  );
}
