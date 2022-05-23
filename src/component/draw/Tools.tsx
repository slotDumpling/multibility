import React, { useRef, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  LoadingOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, InputNumber, Modal, Popover } from "antd";
import { ColorSelect, PenPanel } from "../reader/DrawTools";
import { SelectToolType, TextToolType } from "./Draw";
import { createWorker, Worker } from "tesseract.js";
import TextArea from "antd/lib/input/TextArea";
import { useDrag } from "@use-gesture/react";
import { colors } from "../../lib/color";
import { createPortal } from "react-dom";
import IconFont from "../ui/IconFont";
import classNames from "classnames";
import copy from "clipboard-copy";
import "./tools.sass";
import "animate.css";

const getOcrWorker = (() => {
  let worker: Worker;
  return async () => {
    if (worker) return worker;
    worker = createWorker({ logger: console.log });
    await worker.load();
    await worker.loadLanguage("eng+chi_sim");
    await worker.initialize("eng+chi_sim");
    return worker;
  };
})();

export const SelectTool: SelectToolType = ({
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
    const imageData = rasterize();
    try {
      const worker = await getOcrWorker();
      const result = await worker.recognize(imageData);
      setText(result.data.text);
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

export const TextTool: TextToolType = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(50);
  const [color, setColor] = useState(colors[0]);
  const [modalShow, setModalShow] = useState(true);

  return (
    <Modal
      visible={modalShow}
      title="Insert text"
      onCancel={() => {
        setModalShow(false);
        setTimeout(onCancel, 300);
      }}
      onOk={() => {
        const content = text.trim();
        if (!content) return onCancel();
        onSubmit(content, fontSize, color);
      }}
      bodyStyle={{ paddingTop: 0 }}
    >
      <div className="insert-option">
        <span className="font-size">
          <FontSizeOutlined />
          <span>Font size: </span>
          <InputNumber size="small" value={fontSize} onChange={setFontSize} />
        </span>
        <Popover
          content={<ColorSelect color={color} setColor={setColor} />}
          overlayStyle={{ width: 200 }}
          placement="bottom"
        >
          <Button
            className="tag-btn"
            size="small"
            icon={<FontColorsOutlined />}
          >
            Font color
          </Button>
        </Popover>
      </div>
      <TextArea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Modal>
  );
};
