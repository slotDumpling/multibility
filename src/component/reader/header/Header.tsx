import { useContext } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import { HomeFilled, SaveOutlined } from "@ant-design/icons";
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
  const { saved } = useContext(ReaderStateCtx);
  const { instantSave } = useContext(ReaderMethodCtx);
  const nav = useNavigate();

  return (
    <div className="left">
      <Button
        type="text"
        onClick={async () => {
          await instantSave();
          nav("/");
        }}
        icon={<HomeFilled style={{ opacity: 0.8 }} />}
      />
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
