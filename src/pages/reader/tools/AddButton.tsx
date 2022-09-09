import { FC } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const AddPageButton: FC<{ addFinalPage: () => void }> = ({
  addFinalPage,
}) => {
  return (
    <Button type="dashed" icon={<PlusOutlined />} block onClick={addFinalPage}>
      New page
    </Button>
  );
};
