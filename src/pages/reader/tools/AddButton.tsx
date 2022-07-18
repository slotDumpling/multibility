import { Button } from "antd";
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
