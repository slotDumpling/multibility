import { CSSProperties, FC, RefObject, useEffect, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  PictureTwoTone,
  PictureOutlined,
  BgColorsOutlined,
  AlignLeftOutlined,
  FontColorsOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Modal, Popover, Radio } from "antd";
import { DrawCtrl } from "lib/draw/DrawCtrl";
import { ColorSelect, PenPanel } from "./PenPanel";
import TextArea from "antd/lib/input/TextArea";
import { allColors } from "lib/color";
import { DrawRefType } from "component/Draw";
import { saveAs } from "file-saver";
import "./draw-tools.sass";

const btnProps: ButtonProps = {
  type: "text",
  shape: "round",
  size: "small",
};
export const SelectTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
  clickPoint: paper.Point;
}> = ({ drawRef, visible, clickPoint }) => {
  const [currDrawCtrl, setCurrDrawCtrl] = useState<Partial<DrawCtrl>>({});

  const getRaster = () => {
    if (!drawRef.current) return;
    const imageData = drawRef.current.rasterizeSelected();
    Modal.confirm({
      title: "Screenshot",
      content: <img className="raster" src={imageData} alt="raster" />,
      className: "raster-modal",
      icon: <PictureTwoTone />,
      okText: "Save",
      onOk: () => saveAs(imageData, document.title.split("-")[0] + ".png"),
    });
  };

  const { x, y } = clickPoint;
  return (
    <div
      className="select-tool"
      data-visible={visible}
      style={{ "--pos-x": x + "px", "--pos-y": y + "px" } as CSSProperties}
    >
      <Popover
        trigger="click"
        placement="bottom"
        overlayClassName="style-pop"
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
    </div>
  );
};

export const TextTool: FC<{
  drawRef: RefObject<DrawRefType>;
  visible: boolean;
  pointText?: paper.PointText;
}> = ({ visible, drawRef, pointText }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState(allColors[0]!);
  const [align, setAlign] = useState("center");

  useEffect(() => {
    if (!pointText) return;
    const { name, content, justification, fillColor } = pointText;
    setAlign(justification);
    if (name) {
      setText(content);
      setColor(fillColor?.toCSS(true) ?? allColors[0]!);
    } else {
      setText("");
      setColor(allColors[0]!);
    }
  }, [pointText]);

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
      />
    </Popover>
  );

  const alignRadio = (
    <Radio.Group
      size="small"
      optionType="button"
      value={align}
      buttonStyle="solid"
      onChange={(e) => setAlign(e.target.value)}
      options={[
        { label: <AlignLeftOutlined />, value: "left" },
        { label: <AlignCenterOutlined />, value: "center" },
        { label: <AlignRightOutlined />, value: "right" },
      ]}
    />
  );

  return (
    <Modal
      visible={visible}
      title="Insert text"
      onCancel={() => drawRef.current?.cancelText()}
      onOk={() => {
        const content = text.trim();
        if (!content) return drawRef.current?.cancelText();
        drawRef.current?.submitText(content, color, align);
      }}
      bodyStyle={{ paddingTop: 0 }}
      destroyOnClose
    >
      <div className="insert-option">
        {fontColorBtn}
        {alignRadio}
      </div>
      <TextArea
        size="large"
        rows={3}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Modal>
  );
};
