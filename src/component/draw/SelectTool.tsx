import React from "react";
import {
  DeleteOutlined,
  BgColorsOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Popover } from "antd";
import { PenPanel } from "../reader/DrawTools";
import { SelectToolType } from "./Draw";
import "./tools.sass";


const SelectTool: SelectToolType = ({
  onDelete,
  onRotate,
  mutateStyle,
  currDrawCtrl,
}) => {
  const btnProps: ButtonProps = {
    type: "text",
    shape: "round",
  };

  return (
    <div className="select-tool">
      <Button
        icon={<RotateRightOutlined />}
        onClick={() => onRotate(90, true)}
        {...btnProps}
      />
      <Popover
        trigger="click"
        placement="bottom"
        getPopupContainer={(e) => e}
        destroyTooltipOnHide
        content={
          <PenPanel updateDrawCtrl={mutateStyle} drawCtrl={currDrawCtrl} />
        }
      >
        <Button icon={<BgColorsOutlined />} {...btnProps} />
      </Popover>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={onDelete}
        {...btnProps}
      />
    </div>
  );
};

export default SelectTool;
