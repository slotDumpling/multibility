import { CSSProperties, FC, RefObject, useMemo, useState } from "react";
import {
  CopyOutlined,
  BoldOutlined,
  DeleteOutlined,
  PictureTwoTone,
  PictureOutlined,
  BgColorsOutlined,
  ItalicOutlined,
} from "@ant-design/icons";
import { Button, ButtonProps, Modal, Popover, Select } from "antd";
import { DrawCtrl } from "lib/draw/DrawCtrl";
import { ColorSelect, PenPanel } from "./PenPanel";
import { allColors } from "lib/color";
import { DrawRefType } from "component/Draw";
import { saveAs } from "file-saver";
import { Color } from "paper/dist/paper-core";
import "./draw-tools.sass";
import IconFont from "component/IconFont";

const btnProps: ButtonProps = {
  type: "text",
  shape: "round",
  size: "small",
};

const getPosVars = (x: number, y: number) => {
  return { "--pos-x": x + "px", "--pos-y": y + "px" } as CSSProperties;
};
const getObjVars = (obj: Record<string, string | number>, unit?: string) => {
  const result: Record<string, string | number> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (unit) value += unit;
    result["--" + key] = value;
  });
  return result as CSSProperties;
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
  drawRef: RefObject<DrawRefType>;
  renderSlow: boolean;
}> = ({ pointText, drawRef, renderSlow }) => {
  const { view, position, leading, content, rotation } = pointText;
  const { fontFamily, fontWeight, fontSize } = pointText;

  const { x, y } = view.projectToView(position);
  const { topLeft, bottomLeft } = pointText.bounds;
  const { x: bx, y: by } = view.projectToView(topLeft);
  const { x: bbx, y: bby } = view.projectToView(bottomLeft);
  const optionAtBottom = by < 90;

  const scale = pointText.viewMatrix.scaling.x;
  const { width, height } = pointText.internalBounds;

  const lineHeight = +leading / +fontSize ?? 1.2;

  const color = pointText.fillColor?.toCSS(true) ?? allColors[0]!;
  const fontColorBtn = (
    <Popover
      content={
        <ColorSelect
          color={color}
          setColor={(c) =>
            drawRef.current?.mutatePointText((prev) => {
              prev.fillColor = new Color(c);
            })
          }
        />
      }
      trigger="click"
      overlayStyle={{ width: 200 }}
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
    >
      <Button
        {...btnProps}
        icon={<IconFont type="icon-circle" style={{ color }} />}
      />
    </Popover>
  );

  const { isItalic, isBold } = parseFontStyle(fontWeight);
  const fontStyleCSS = {
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
  };

  const fontFamilySelect = (
    <Select
      className="font-select"
      popupClassName="font-drop"
      value={fontFamily}
      onChange={(v) => {
        drawRef.current?.mutatePointText((prev) => {
          prev.fontFamily = v;
        });
      }}
      size="small"
      bordered={false}
      virtual={false}
      getPopupContainer={(e) => e.parentElement.parentElement!}
      dropdownMatchSelectWidth={100}
      options={[
        { value: "Arial, sans-serif", name: "Arial" },
        { value: "'Times New Roman', serif", name: "Times" },
        { value: "Georgia, serif", name: "Georgia" },
        { value: "'Courier New', monospace", name: "Courier" },
      ].map(({ value, name }) => ({
        value,
        label: (
          <span style={{ fontFamily: value, fontWeight: "normal" }}>
            {name}
          </span>
        ),
      }))}
    />
  );

  const offset = useMemo(
    // paperjs sets all baseline ratio to 0.75.
    () => 0.75 - getBaselineRatio(fontFamily, lineHeight),
    [fontFamily, lineHeight]
  );

  return (
    <div
      className="text-tool"
      style={{
        ...getObjVars({ scale, color }),
        ...getObjVars({ rotation }, "deg"),
        ...getObjVars({ width, height }, "px"),
        ...getObjVars({ offset }, "em"),
        ...getPosVars(x, y),
      }}
    >
      <div
        className="textarea-wrapper"
        data-slow={renderSlow}
        data-empty={!content}
        style={{ fontSize, fontFamily, lineHeight, ...fontStyleCSS }}
      >
        <textarea
          autoFocus={!content}
          placeholder="Text"
          value={content}
          onChange={(e) => {
            drawRef.current?.mutatePointText((prev) => {
              prev.content = e.target.value;
            });
          }}
        />
      </div>
      <div
        className="tool-options text-options"
        data-bottom={optionAtBottom}
        style={{
          ...(optionAtBottom ? getPosVars(bbx, bby) : getPosVars(bx, by)),
        }}
      >
        <div className="row">
          {fontFamilySelect}
          {fontColorBtn}
        </div>
        <div className="row">
          <Button
            onClick={() => {
              drawRef.current?.mutatePointText((prev) => {
                prev.fontWeight = toggleBold(prev.fontWeight);
              });
            }}
            {...btnProps}
            type={isBold ? "link" : "text"}
            icon={<BoldOutlined />}
          />
          <Button
            onClick={() => {
              drawRef.current?.mutatePointText((prev) => {
                prev.fontWeight = toggleItalic(prev.fontWeight);
              });
            }}
            {...btnProps}
            type={isItalic ? "link" : "text"}
            icon={<ItalicOutlined />}
          />
          <Button
            {...btnProps}
            icon={<IconFont type="icon-font_size_down" />}
            onClick={() => {
              drawRef.current?.mutatePointText((prev) => {
                const { topLeft } = prev.bounds;
                prev.scale(0.9, topLeft);
              });
            }}
          />
          <Button
            {...btnProps}
            icon={<IconFont type="icon-font_size_up" />}
            onClick={() => {
              drawRef.current?.mutatePointText((prev) => {
                const { topLeft } = prev.bounds;
                prev.scale(1.1, topLeft);
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

const parseFontStyle = (fontStyle: string | number) => {
  fontStyle = fontStyle + "";
  const isItalic = /italic/g.test(fontStyle);
  const isBold = /bold/g.test(fontStyle);
  return { isItalic, isBold };
};

const toggleItalic = (fontStyle: string | number) => {
  const { isItalic, isBold } = parseFontStyle(fontStyle);
  const boldText = isBold ? "bold" : "normal";
  return (isItalic ? "" : "italic ") + boldText;
};

const toggleBold = (fontStyle: string | number) => {
  const { isItalic, isBold } = parseFontStyle(fontStyle);
  const italicText = isItalic ? "italic " : "";
  return italicText + (isBold ? "normal" : "bold");
};

const getBaselineRatio = (fontFamily: string, lineHeight: number) => {
  const div = document.createElement("div");
  div.innerText = "p";
  Object.assign(div.style, { fontSize: "100px", fontFamily, lineHeight });
  document.body.appendChild(div);

  const span = document.createElement("span");
  span.style.display = "inline-block";
  div.appendChild(span);

  const r0 = div.getBoundingClientRect();
  const r1 = span.getBoundingClientRect();
  const ratio = (r1.y - r0.y) / r0.height;
  document.body.removeChild(div);
  return Math.max(-1, Math.min(ratio, 1));
};
