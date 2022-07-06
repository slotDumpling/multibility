import { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeFilled, SaveOutlined } from "@ant-design/icons";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";

export default function ReaderHeader({
  saved,
  handleUndo,
  handleRedo,
  instantSave,
}: {
  saved: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}) {
  return (
    <header>
      <HeaderLeft saved={saved} instantSave={instantSave} />
      <HeaderMiddle handleUndo={handleUndo} handleRedo={handleRedo} />
      <HeaderRight instantSave={instantSave} />
    </header>
  );
}

const HeaderLeft: FC<{
  saved: boolean;
  instantSave: () => Promise<void> | undefined;
}> = ({ saved, instantSave }) => {
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
