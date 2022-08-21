import { CSSProperties, FC, RefObject, useState } from "react";
import {
  CopyOutlined,
  BoldOutlined,
  DeleteOutlined,
  PictureTwoTone,
  PictureOutlined,
  BgColorsOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Modal, Popover } from "antd";
import { DrawCtrl } from "lib/draw/DrawCtrl";
import { ColorSelect, PenPanel } from "./PenPanel";
import { allColors } from "lib/color";
import { DrawRefType } from "component/Draw";
import { saveAs } from "file-saver";
import { Color } from "paper/dist/paper-core";
import "./draw-tools.sass";

const btnProps: ButtonProps = {
  type: "text",
  shape: "round",
  size: "small",
};

const getPosVars = (x: number, y: number) => {
  return { "--pos-x": x + "px", "--pos-y": y + "px" } as CSSProperties;
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
      onOk: () => saveAs(imageData, document.title.split(" - ")[0] + ".png"),
    });
  };

  const { x, y } = clickPoint;
  return (
    <div
      className="select-tool tool-options"
      data-visible={visible}
      style={getPosVars(x, y)}
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
  pointText: paper.PointText;
}> = ({ pointText }) => {
  const [text, setText] = useState(pointText.content);
  const [color, setColor] = useState(
    pointText.fillColor?.toCSS(true) ?? allColors[0]!
  );

  const { topLeft } = pointText.bounds;
  const { x, y } = pointText.view.projectToView(topLeft);

  const scale = pointText.viewMatrix.a;
  const fontSize = +pointText.fontSize;
  const size = pointText.bounds.size.divide(pointText.matrix.a);
  const width = pointText.content ? size.width + "px" : "7em";
  const height = size.height + "px";

  const fontColorBtn = (
    <Popover
      content={
        <ColorSelect
          color={color}
          setColor={(c) => {
            pointText.fillColor = new Color(c);
            setColor(c);
          }}
        />
      }
      trigger="click"
      overlayStyle={{ width: 200 }}
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
    >
      <Button {...btnProps} icon={<BgColorsOutlined />} />
    </Popover>
  );

  const [bold, setBold] = useState(pointText.fontWeight === "bold");
  const fontWeight = bold ? "bold" : "normal";
  const [, setSize] = useState(0);
  const vars = {
    "--scale": scale,
    "--width": width,
    "--height": height,
    ...getPosVars(x, y),
  } as CSSProperties;

  const popContent = (
    <div className="tool-options">
      {fontColorBtn}
      <Button
        onClick={() => {
          pointText.fontWeight = bold ? "normal" : "bold";
          setBold((prev) => !prev);
        }}
        {...btnProps}
        type={bold ? "link" : "text"}
        icon={<BoldOutlined />}
      />
      <Button
        {...btnProps}
        icon={<ZoomOutOutlined />}
        onClick={() => {
          pointText.scale(0.9, topLeft);
          setSize((prev) => prev - 1);
        }}
      />
      <Button
        {...btnProps}
        icon={<ZoomInOutlined />}
        onClick={() => {
          pointText.scale(1.1, topLeft);
          setSize((prev) => prev + 1);
        }}
      />
    </div>
  );

  return (
    <Popover
      overlayClassName="textarea-pop"
      content={popContent}
      getPopupContainer={(e) => e.parentElement!}
      placement="topLeft"
      visible
    >
      <div className="textarea-wrapper" style={{ fontSize, ...vars }}>
        <textarea
          placeholder="Insert Text..."
          value={text}
          style={{ fontSize, color, fontWeight }}
          onChange={(e) => {
            const t = e.target.value;
            setText(t);
            pointText.content = t;
          }}
        />
      </div>
    </Popover>
  );
};
