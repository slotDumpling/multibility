import { Button } from "antd";
import { useContext } from "react";
import { MenuStateCtx, MenuStateUpdateCtx } from "./MainMenu";

export default function LeftTools() {
  const { editing } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuStateUpdateCtx);

  function swichEditing() {
    setEditing((prev) => !prev);
  }

  return (
    <div className="left-tools">
      <Button onClick={swichEditing} type={editing ? "primary" : "text"} block>
        {editing ? "Done" : "Edit"}
      </Button>
    </div>
  );
}
