import { Button, Drawer } from "antd";
import { useContext, useState } from "react";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import {
  EditOutlined,
  CheckOutlined,
  MenuFoldOutlined,
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

  const AsideButton = (
    <div className="aside-btn">
      <Button
        type="text"
        icon={asideOn ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={() => setAsideOn(prev => !prev)}
      />
      <Drawer
        className="aside-drawer"
        width={300}
        placement="left"
        visible={asideOn}
        closable={false}
        onClose={() => setAsideOn(false)}
        contentWrapperStyle={{ boxShadow: 'none' }}
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
