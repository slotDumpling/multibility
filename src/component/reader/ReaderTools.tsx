import { Button, Input, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { PlusOutlined } from "@ant-design/icons";

export const AddPageButton = () => {
  const { addFinalPage } = useContext(ReaderMethodCtx);
  return (
    <div className="add-btn-wrapper">
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        onClick={addFinalPage}
      >
        New page
      </Button>
    </div>
  );
};

export const NoteHeader = () => {
  const { noteInfo } = useContext(ReaderStateCtx);
  const [noteName, setNoteName] = useState("");
  useEffect(() => {
    if (!noteInfo) return;
    setNoteName(noteInfo?.name);
  }, [noteInfo]);

  if (!noteInfo) return null;

  return (
    <div className="note-header">
      <Input value={noteName} bordered={false} />
    </div>
  );
};

export const showPageDelMsg = (onUndo: () => void) => {
  message.warning({
    content: (
      <>
        One page was deleted.
        <Button
          size="small"
          type="link"
          onClick={() => {
            message.destroy("DELETE");
            onUndo();
          }}
        >
          Undo
        </Button>
      </>
    ),
    key: "DELETE",
    duration: 10,
  });
};
