import { Button, Drawer } from "antd";
import { useContext, useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import SideMenu from "./SideMenu";
import { MenuCtx } from "./MainMenu";

export default function LeftTools() {
  const [asideOn, setAsideOn] = useState(false);
  const { editing, tagUid, setEditing } = useContext(MenuCtx);

  useEffect(() => {
    if (!editing) setAsideOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagUid]);

  const editButton = (
    <Button
      className="edit-btn large"
      onClick={() => setEditing((prev) => !prev)}
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
        <SideMenu />
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
