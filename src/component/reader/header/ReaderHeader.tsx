import { useContext } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import { TeamCtx } from "../Team";
import { HomeFilled, SaveOutlined } from "@ant-design/icons";
import { updatePages } from "../../../lib/network/http";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";

export default function ReaderHeader() {
  return (
    <header>
      <HeaderLeft />
      <HeaderMiddle />
      <HeaderRight />
    </header>
  );
}

const HeaderLeft = () => {
  const { saved, noteID } = useContext(ReaderStateCtx);
  const { instantSave } = useContext(ReaderMethodCtx);
  const { teamOn } = useContext(TeamCtx);
  const nav = useNavigate();

  return (
    <div className="left">
      <Button
        type="text"
        onClick={async () => {
          await instantSave();
          if (teamOn) updatePages(noteID);
          nav("/");
        }}
        icon={<HomeFilled style={{ opacity: 0.8 }} />}
      />
      <div className="br" />
      <Button
        type="text"
        className="save"
        onClick={instantSave}
        disabled={saved}
        icon={<SaveOutlined />}
      />
    </div>
  );
};
