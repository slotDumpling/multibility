import { Button } from "antd";
import { useContext } from "react";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";
import {} from "@ant-design/icons";

export default function LeftTools() {
  const { editing } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuStateUpdateCtx);

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  return (
    <div id="left-tools">
      <Button onClick={swichEditing} type={editing ? "primary" : "text"}>
        {editing ? "Done" : "Edit"}
      </Button>
    </div>
  );
}
