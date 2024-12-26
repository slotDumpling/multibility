import React, { FC, ReactNode, useState } from "react";
import { Button, ButtonProps, Input, Popover, Segmented, Tooltip } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  LinkOutlined,
  BorderOutlined,
  GatewayOutlined,
  PictureOutlined,
  HighlightTwoTone,
  HighlightOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import IconFont from "component/IconFont";
import { PenPanel, WidthSelect } from "../tools/PenPanel";
import { DrawCtrl } from "draft-pad/dist/lib";
import { useDrawCtrl, useUpdateDrawCtrl } from "lib/draw/DrawCtrl";

const btnProps: ButtonProps = { type: "text" };
const addTip = (icon: React.ReactNode, title = ""): React.ReactNode => (
  <Tooltip
    trigger="hover"
    placement="bottom"
    title={title}
    overlayClassName="middle-btn-tip"
  >
    {icon}
  </Tooltip>
);

export const HeaderMiddle: FC<{
  handleUndo: () => void;
  handleRedo: () => void;
  undoable: boolean;
  redoable: boolean;
}> = ({ handleUndo, handleRedo, undoable, redoable }) => (
  <div className="middle">
    <Button
      {...btnProps}
      icon={addTip(<UndoOutlined />, "Undo")}
      onClick={handleUndo}
      disabled={!undoable}
    />
    <Button
      className="redo-btn"
      {...btnProps}
      icon={addTip(<RedoOutlined />, "Redo")}
      onClick={handleRedo}
      disabled={!redoable}
    />
    <PenButton />
    <EraserButton />
    <AddMoreButtons />
    <SelectButton />
  </div>
);

const PenButton = () => {
  const drawCtrl = useDrawCtrl();
  const { mode, color } = drawCtrl;
  const updateDrawCtrl = useUpdateDrawCtrl();

  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} drawCtrl={drawCtrl} />}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
      destroyTooltipOnHide
    >
      <Button
        type="link"
        icon={addTip(
          <HighlightTwoTone twoToneColor={color} className="pen-icon" />,
          "Draw"
        )}
        data-active={mode === "draw"}
      />
    </Popover>
  ) : (
    <Button
      {...btnProps}
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      icon={addTip(<HighlightOutlined />, "Draw")}
    />
  );
};

const EraserButton = () => {
  const drawCtrl = useDrawCtrl();
  const { mode, pixelEraser } = drawCtrl;
  const updateDrawCtrl = useUpdateDrawCtrl();

  const pixelSeg = (
    <Segmented
      block
      size="small"
      className="pixel-seg"
      options={["Pixel", "Object"]}
      value={pixelEraser ? "Pixel" : "Object"}
      onChange={(value) => {
        if (value === "Pixel") updateDrawCtrl({ pixelEraser: true });
        else updateDrawCtrl({ pixelEraser: false });
      }}
    />
  );

  return mode === "erase" ? (
    <Popover
      content={
        <div className="erase-panel">
          {pixelSeg}
          <WidthSelect
            drawCtrl={drawCtrl}
            updateDrawCtrl={updateDrawCtrl}
            field="eraserWidth"
          />
        </div>
      }
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
      destroyTooltipOnHide
    >
      <Button
        type="link"
        icon={addTip(<IconFont type="icon-eraser" />, "Eraser")}
        data-active={mode === "erase"}
      />
    </Popover>
  ) : (
    <Button
      {...btnProps}
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      icon={addTip(<IconFont type="icon-eraser" />, "Eraser")}
    />
  );
};

const SelectButton = () => {
  const { lasso, mode } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();

  const icon = addTip(
    lasso ? <IconFont type="icon-lasso1" /> : <GatewayOutlined />,
    "Lasso"
  );

  return mode === "select" ? (
    <Button
      type="link"
      icon={icon}
      onClick={() => updateDrawCtrl({ lasso: !lasso })}
      data-active={mode === "select"}
    />
  ) : (
    <Button
      {...btnProps}
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
    />
  );
};

const AddMoreButtons: FC = () => {
  const drawCtrl = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();
  const { mode, imageSrc } = drawCtrl;

  const getButton = (
    modeName: DrawCtrl["mode"],
    icon: ReactNode,
    className?: string
  ) => (
    <Button
      key={modeName}
      className={className}
      type={mode === modeName ? "link" : "text"}
      onClick={() => updateDrawCtrl({ mode: modeName })}
      icon={icon}
      data-active={mode === modeName}
    />
  );

  const buttons: Record<string, ReactNode> = {
    text: getButton("text", addTip(<IconFont type="icon-text1" />, "Add text")),
    picture: getButton("picture", addTip(<PictureOutlined />, "Add image")),
    rect: getButton("rect", addTip(<BorderOutlined />, "Add rectangle")),
  };

  const [showImage, setShowImage] = useState(false);

  const optionPanels: Record<string, ReactNode> = {
    text: <div className="text-option">Tap anywhere to insert text.</div>,
    picture: (
      <div className="picture-option">
        <Input
          value={imageSrc}
          onChange={(e) => updateDrawCtrl({ imageSrc: e.target.value })}
          prefix={<LinkOutlined />}
          placeholder="Image URL"
          allowClear
        />
        {
          <img
            src={imageSrc}
            alt="inserted"
            data-show={showImage}
            onLoad={() => setShowImage(true)}
            onError={() => setShowImage(false)}
          />
        }
      </div>
    ),
    rect: <PenPanel {...{ drawCtrl, updateDrawCtrl }} />,
  };

  const content = (
    <div className="add-pop">
      <div className="button-row">{Object.values(buttons)}</div>
      {/^(text|picture|rect)$/.test(mode) && (
        <div className="option-panel" data-mode={mode}>
          {optionPanels[mode]}
        </div>
      )}
    </div>
  );
  return (
    <>
      {Object.entries(buttons).map(([key, btn]) => (
        <Popover
          key={"pop-" + key}
          className="btn-for-desktop"
          content={optionPanels[key]}
          trigger="click"
          placement="bottomRight"
          getPopupContainer={(e) => e.parentElement!}
        >
          {btn}
        </Popover>
      ))}
      <Popover
        className="btn-for-phone"
        content={content}
        trigger="click"
        placement="bottomRight"
        getPopupContainer={(e) => e.parentElement!}
      >
        {buttons[mode] ?? (
          <Button
            type="text"
            icon={addTip(<PlusCircleOutlined />, "Add more")}
          />
        )}
      </Popover>
    </>
  );
};
