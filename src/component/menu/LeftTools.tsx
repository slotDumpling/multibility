import { Button, Drawer } from "antd";
import { useContext, useState } from "react";
import { MenuStateCtx, MenuMethodCtx } from "./MainMenu";
import { MenuOutlined } from "@ant-design/icons";
import SideMenu from "./SideMenu";

export default function LeftTools() {
  const [asideOn, setAsideOn] = useState(false);
  const { editing } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuMethodCtx);

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  const editButton = (
    <Button
      className="edit-btn large"
      onClick={swichEditing}
      type={editing ? "primary" : "text"}
    >
      {editing ? "Done" : "Edit"}
    </Button>
  );

  const AsideButton = (
    <>
      <Button
        className="aside-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setAsideOn((prev) => !prev)}
      />
      <Drawer
        className="aside-drawer"
        width={300}
        placement="left"
        closable={false}
        visible={asideOn}
        onClose={() => setAsideOn(false)}
        contentWrapperStyle={{ boxShadow: "none" }}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        destroyOnClose
      >
        <SideMenu onSelect={() => editing || setAsideOn(false)} />
      </Drawer>
    </>
  );

  return (
    <div className="left-tools">
      {AsideButton}
      {editButton}
    </div>
  );
}
