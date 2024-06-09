import { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeFilled, SaveOutlined, PrinterOutlined } from "@ant-design/icons";

export const HeaderLeft: FC<{
  saved: boolean;
  instantSave: () => Promise<void> | undefined;
  handleExportPDF: () => Promise<void>;
}> = ({ saved, instantSave, handleExportPDF }) => {
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
      {saved ? (
        <Button
          type="text"
          className="save"
          onClick={handleExportPDF}
          icon={<PrinterOutlined />}
        />
      ) : (
        <Button
          type="text"
          className="save"
          onClick={instantSave}
          icon={<SaveOutlined />}
        />
      )}
    </div>
  );
};
