import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";
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
import { CSSTransition } from "react-transition-group";
import { DrawCtrl } from "../../../lib/draw/drawCtrl";
import { createWorker, Worker } from "tesseract.js";
import { ColorSelect, PenPanel } from "./PenPanel";
import TextArea from "antd/lib/input/TextArea";
import { DrawRefType } from "../../draw/Draw";
import { useDrag } from "@use-gesture/react";
import { colors } from "../../../lib/color";
import { ReaderStateCtx } from "../Reader";
import IconFont from "../../ui/IconFont";
import copy from "clipboard-copy";
import "./drawTools.sass";

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

  return (
    <CSSTransition timeout={300} in={visible} unmountOnExit>
      <div className="select-tool">
        <Popover
          trigger="click"
          placement="bottom"
          getPopupContainer={(e) => e.parentElement!}
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
        <div className="rotate-wrapper" data-dragged={dragged} ref={rotateEl}>
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
      </div>
    </CSSTransition>
  );
};

export const TextTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
}> = ({ visible, drawRef }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(5);
  const [color, setColor] = useState(colors[0]);
  const { drawCtrl } = useContext(ReaderStateCtx);

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
      <div className="insert-option" data-dark={drawCtrl.dark}>
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
          getPopupContainer={(e) => e.parentElement!}
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
