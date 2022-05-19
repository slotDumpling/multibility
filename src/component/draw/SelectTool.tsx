import React, { useRef, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  LoadingOutlined,
  BgColorsOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Modal, Popover } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PenPanel } from "../reader/DrawTools";
import { useDrag } from "@use-gesture/react";
import { createPortal } from "react-dom";
import { SelectToolType } from "./Draw";
import IconFont from "../ui/IconFont";
import classNames from "classnames";
import copy from "clipboard-copy";
import "./tools.sass";
import "animate.css";

const SelectTool: SelectToolType = ({
  onDelete,
  onRotate,
  onDuplicate,
  mutateStyle,
  rasterize,
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
  const gearStyle = { transform: `translateX(${transX}px)` };

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
      rubberband: 0.05,
      bounds: { left: -90, right: 90 },
    }
  );

  const [recoginzing, setRecoginzing] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [text, setText] = useState("");
  const recognizeText = async () => {
    setRecoginzing(true);
    const data = rasterize();
    const { createWorker } = await import("tesseract.js");
    try {
      const worker = createWorker({ logger: console.log });
      await worker.load();
      await worker.loadLanguage("eng+chi_sim");
      await worker.initialize("eng+chi_sim");
      const {
        data: { text },
      } = await worker.recognize(data);
      await worker.terminate();
      setText(text);
      setModalShow(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRecoginzing(false);
    }
  };

  return createPortal(
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
        icon={recoginzing ? <LoadingOutlined /> : <IconFont type="icon-OCR" />}
        onClick={recognizeText}
        {...btnProps}
      />
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={onDelete}
        {...btnProps}
      />
      <Modal
        visible={modalShow}
        title="OCR Result"
        onCancel={() => setModalShow(false)}
        onOk={() => {
          copy(text);
          setModalShow(false);
          setText("");
        }}
        okText="Copy"
        destroyOnClose
      >
        <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      </Modal>
    </div>,
    document.body
  );
};

export default SelectTool;
