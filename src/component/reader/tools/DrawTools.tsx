import { FC, RefObject, useContext, useEffect, useRef, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  PictureOutlined,
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
import { ColorSelect, PenPanel } from "./PenPanel";
import TextArea from "antd/lib/input/TextArea";
import { DrawRefType } from "../../draw/Draw";
import { useDrag } from "@use-gesture/react";
import { colors } from "../../../lib/color";
import { ReaderStateCtx } from "../Reader";
import { saveAs } from "file-saver";
import "./drawTools.sass";
import { createPortal } from "react-dom";

export const SelectTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
}> = ({ drawRef, visible }) => (
  <CSSTransition timeout={300} in={visible} unmountOnExit>
    <SelectToolContent drawRef={drawRef} />
  </CSSTransition>
);

export const SelectToolContent: FC<{
  drawRef: RefObject<DrawRefType>;
}> = ({ drawRef }) => {
  const btnProps: ButtonProps = {
    type: "text",
    shape: "round",
    size: "small",
  };

  const [currDrawCtrl, setCurrDrawCtrl] = useState<Partial<DrawCtrl>>({});
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

  const getRaster = () => {
    if (!drawRef.current) return;
    const imageData = drawRef.current.rasterize();
    Modal.confirm({
      title: "Screenshot",
      content: <img className="raster" src={imageData} alt="raster" />,
      className: "raster-modal",
      icon: <PictureOutlined />,
      okText: "Save",
      onOk: () => saveAs(imageData, "screenshot"),
    });
  };

  return createPortal(
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
      <Button icon={<PictureOutlined />} onClick={getRaster} {...btnProps} />
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => drawRef.current?.deleteSelected()}
        {...btnProps}
      />
    </div>,
    document.querySelector('.reader.container > header')!
  );
};

export const TextTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
}> = ({ visible, drawRef }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(5);
  const [color, setColor] = useState(colors[0]);
  const { forceLight } = useContext(ReaderStateCtx);

  useEffect(() => {
    setText("");
    setFontSize(5);
    setColor(colors[0]);
  }, [visible]);

  const fontSizeInput = (
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
  );

  const fontColorBtn = (
    <Popover
      content={<ColorSelect color={color} setColor={setColor} />}
      overlayStyle={{ width: 200 }}
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
    >
      <Button
        size="small"
        icon={<FontColorsOutlined className="font-icon" style={{ color }} />}
      >
        Font color
      </Button>
    </Popover>
  );

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
      <div className="insert-option" data-force-light={forceLight}>
        {fontSizeInput}
        {fontColorBtn}
      </div>
      <TextArea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Modal>
  );
};
