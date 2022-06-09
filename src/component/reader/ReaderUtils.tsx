import { Button, message } from "antd";
import React, { useContext } from "react";
import { ReaderMethodCtx } from "./Reader";
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
