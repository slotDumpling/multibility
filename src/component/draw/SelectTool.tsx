import React, { useRef, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  BgColorsOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Popover } from "antd";
import { PenPanel } from "../reader/DrawTools";
import { useDrag } from "@use-gesture/react";
import { SelectToolType } from "./Draw";
import classNames from "classnames";
import "./tools.sass";
import "animate.css";

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
    size: "small",
  };

  const rotateEl = useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = useState(false);
  const [transX, setTransX] = useState(0);
  const gearStyle = { transform: `translateX(${transX}px)` }

  const [rotateCount, setRotateCount] = useState(0);
  const shakeShow = rotateCount % 4 === 1;
  const btnClass = shakeShow
    ? "animate__animated animate__headShake"
    : undefined;

  useDrag(
    ({ first, last, offset, delta }) => {
      setTransX(offset[0]);
      onRotate(delta[0] / 2, last);
      first && setDragged(true);
      last && setDragged(false);
    },
    {
      target: rotateEl,
      filterTaps: true,
      rubberband: true,
      bounds: { left: -90, right: 90 },
    }
  );

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
      <div className={classNames("rotate-wrapper", { dragged })} ref={rotateEl}>
        <Button
          className={btnClass}
          icon={<RotateRightOutlined />}
          onClick={() => {
            setRotateCount((prev) => prev + 1);
            onRotate(90, true);
          }}
          {...btnProps}
        />
        <div className="gear" style={gearStyle} />
      </div>
      <Button icon={<CopyOutlined />} onClick={onDuplicate} {...btnProps} />
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
