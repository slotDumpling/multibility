import { Button, Drawer } from "antd";
import { useContext, useState } from "react";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  EditOutlined,
  CheckOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import SideMenu from "./SideMenu";

export default function LeftTools() {
  const [asideOn, setAsideOn] = useState(false);
  const { editing } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuMethodCtx);

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  const SmallEditButton = (
    <Button
      className="edit-btn small"
      onClick={swichEditing}
      type={editing ? "primary" : "text"}
      size="small"
    >
      {editing ? <CheckOutlined /> : <EditOutlined />}
    </Button>
  );

  const largeEditButton = (
    <Button
      className="edit-btn large"
      onClick={swichEditing}
      type={editing ? "primary" : "text"}
      block
    >
      {editing ? "Done" : "Edit"}
    </Button>
  );

  const AsideTitle = (
    <div className="aside-drawer-title">
      <span>Tags</span>
      {SmallEditButton}
    </div>
  );

  const AsideButton = (
    <div className="aside-btn">
      <Button
        type="text"
        icon={<MenuUnfoldOutlined />}
        onClick={() => setAsideOn(true)}
      />
      <Drawer
        className="aside-drawer"
        visible={asideOn}
        onClose={() => setAsideOn(false)}
        placement="left"
        title={AsideTitle}
        closable={false}
        width={300}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        destroyOnClose
      >
        <SideMenu onSelect={() => setAsideOn(false)} />
      </Drawer>
    </div>
  );

  return (
    <div className="left-tools">
      {AsideButton}
      {largeEditButton}
      {SmallEditButton}
    </div>
  );
}
