import { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeFilled, SaveOutlined } from "@ant-design/icons";

export const HeaderLeft: FC<{
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
