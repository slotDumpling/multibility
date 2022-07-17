import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FC } from "react";

export const AddPageButton: FC<{ addFinalPage: () => void }> = ({
  addFinalPage,
}) => {
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
