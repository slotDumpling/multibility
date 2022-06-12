import { FC, RefObject, useEffect, useRef, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  CaretLeftOutlined,
  FontColorsOutlined,
  CaretRightOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, InputNumber, Modal, Popover } from "antd";
import { createWorker, Worker } from "tesseract.js";
import { DrawCtrl } from "../../lib/draw/drawCtrl";
import TextArea from "antd/lib/input/TextArea";
import { useDrag } from "@use-gesture/react";
import { DrawRefType } from "../draw/Draw";
import { colors } from "../../lib/color";
import { createPortal } from "react-dom";
import IconFont from "../ui/IconFont";
import classNames from "classnames";
import copy from "clipboard-copy";
import "./drawTools.sass";
import { ColorSelect, PenPanel } from "./header/Middle";

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

export const SelectTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
}> = ({ drawRef, visible }) => {
  const btnProps: ButtonProps = {
    type: "text",
    shape: "round",
    size: "small",
  };

  const [currDrawCtrl, setCurrDrawCtrl] = useState<Partial<DrawCtrl>>({});
  useEffect(() => setCurrDrawCtrl({}), [visible]);
  const rotateEl = useRef<HTMLDivElement>(null);
  const [dragged, setDragged] = useState(false);
  const [transX, setTransX] = useState(0);
  const gearStyle = { transform: `translateX(${transX}px)` };

  useDrag(
    ({ first, last, offset, delta }) => {
      setTransX(offset[0]);
      drawRef.current?.rotateSelected(delta[0] / 2, last);
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
  const recognizeText = async () => {
    setRecoginzing(true);
    if (!drawRef.current) return;
    const imageData = drawRef.current.rasterize();
    try {
      const worker = await getOcrWorker();
      const { text } = (await worker.recognize(imageData)).data;
      Modal.confirm({
        title: "OCR Result",
        content: <TextArea defaultValue={text} />,
        icon: <IconFont type="icon-OCR" />,
        okText: "Copy",
        onOk: () => copy(text),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setRecoginzing(false);
    }
  };

  return createPortal(
    <div className={classNames("select-tool", { visible })}>
      <Popover
        trigger="click"
        placement="bottom"
        getPopupContainer={(e) => e}
        destroyTooltipOnHide
        content={
          <PenPanel
            updateDrawCtrl={(updated) => {
              setCurrDrawCtrl((prev) => ({ ...prev, ...updated }));
              drawRef.current?.mutateStyle(updated);
            }}
            drawCtrl={currDrawCtrl}
          />
        }
      >
        <Button icon={<BgColorsOutlined />} {...btnProps} />
      </Popover>
      <div className={classNames("rotate-wrapper", { dragged })} ref={rotateEl}>
        <Button
          icon={<RotateRightOutlined />}
          onClick={() => drawRef.current?.rotateSelected(90, true)}
          {...btnProps}
        />
        <CaretLeftOutlined className="arrow left" />
        <CaretRightOutlined className="arrow right" />
        <div className="gear" style={gearStyle} />
      </div>
      <Button
        icon={<CopyOutlined />}
        onClick={() => drawRef.current?.duplicateSelected()}
        {...btnProps}
      />
      <Button
        icon={<IconFont type="icon-OCR" />}
        loading={recoginzing}
        onClick={recognizeText}
        {...btnProps}
      />
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => drawRef.current?.deleteSelected()}
        {...btnProps}
      />
    </div>,
    document.body
  );
};

export const TextTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
}> = ({ visible, drawRef }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(5);
  const [color, setColor] = useState(colors[0]);

  return (
    <Modal
      visible={visible}
      title="Insert text"
      onCancel={() => drawRef.current?.cancelText()}
      onOk={() => {
        const content = text.trim();
        if (!content) return drawRef.current?.cancelText();
        drawRef.current?.submitText(content, fontSize, color);
      }}
      bodyStyle={{ paddingTop: 0 }}
      destroyOnClose
    >
      <div className="insert-option">
        <span className="font-size">
          <FontSizeOutlined />
          <span>Font size: </span>
          <InputNumber
            min={1}
            size="small"
            value={fontSize}
            onChange={setFontSize}
          />
        </span>
        <Popover
          content={<ColorSelect color={color} setColor={setColor} />}
          overlayStyle={{ width: 200 }}
          placement="bottom"
        >
          <Button
            className="tag-btn"
            size="small"
            icon={<FontColorsOutlined style={{ color }} />}
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
