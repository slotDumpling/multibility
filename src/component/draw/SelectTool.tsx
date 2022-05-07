import React from "react";
import {
  CopyOutlined,
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
  onDuplicate,
  mutateStyle,
  currDrawCtrl,
}) => {
  const btnProps: ButtonProps = {
    type: "text",
    shape: "round",
    size: 'small',
  };

  return (
    <div className="select-tool">
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
        icon={<CopyOutlined />}
        onClick={onDuplicate}
        {...btnProps}
      />
      <Button
        icon={<RotateRightOutlined />}
        onClick={() => onRotate(90, true)}
        {...btnProps}
      />
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
