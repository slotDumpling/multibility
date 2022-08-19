import { CSSProperties, FC, RefObject, useMemo, useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  PictureTwoTone,
  PictureOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Modal, Popover } from "antd";
import { DrawCtrl } from "lib/draw/DrawCtrl";
import { ColorSelect, PenPanel } from "./PenPanel";
import { allColors } from "lib/color";
import { DrawRefType } from "component/Draw";
import { saveAs } from "file-saver";
import "./draw-tools.sass";
import { Color } from "paper/dist/paper-core";

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
      onOk: () => saveAs(imageData, document.title.split(" - ")[0] + ".png"),
    });
  };

  const { x, y } = clickPoint;
  return (
    <div
      className="select-tool tool-options"
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
  pointText: paper.PointText;
  drawRef: RefObject<DrawRefType>;
}> = ({ pointText, drawRef }) => {
  const [text, setText] = useState(pointText.content);
  const [color, setColor] = useState(
    pointText.fillColor?.toCSS(true) ?? allColors[0]!
  );

  const { x: left, y: top } = useMemo(() => {
    const { topLeft } = pointText.bounds;
    return pointText.view.projectToView(topLeft);
  }, [pointText]);

  const ratio = pointText.viewMatrix.a;
  const fontSize = +pointText.fontSize * ratio;
  const size = pointText.bounds.size.multiply(ratio);
  const width = pointText.content ? `calc(${size.width}px + 1em)` : "8em";
  const height = `calc(${size.height}px + 0.2em)`;

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

  return (
    // text-wrapper must be the child of draw-wrapper.
    <>
      <div
        className="text-wrapper"
        style={{ left, top, maxWidth: `calc(100% - ${left}px)` }}
      >
        <textarea
          autoFocus
          placeholder="Insert Text..."
          style={{ fontSize, color, width, height }}
          value={text}
          onChange={(e) => {
            const t = e.target.value;
            setText(t);
            pointText.content = t;
          }}
        />
      </div>
      <div className="text-options tool-options" style={{ left, top }}>
        {fontColorBtn}
      </div>
    </>
  );
};
