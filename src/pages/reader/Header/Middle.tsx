import { FC, ReactNode, useState } from "react";
import { Button, ButtonProps, Input, Popover, Segmented } from "antd";
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

export const HeaderMiddle: FC<{
  handleUndo: () => void;
  handleRedo: () => void;
  undoable: boolean;
  redoable: boolean;
}> = ({ handleUndo, handleRedo, undoable, redoable }) => (
  <div className="middle">
    <Button
      {...btnProps}
      icon={<UndoOutlined />}
      onClick={handleUndo}
      disabled={!undoable}
    />
    <Button
      className="redo-btn"
      {...btnProps}
      icon={<RedoOutlined />}
      onClick={handleRedo}
      disabled={!redoable}
    />
    <PenButton />
    <EraserButton />
    <SelectButton />
    <AddButton />
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
        icon={<HighlightTwoTone twoToneColor={color} className="pen-icon" />}
        data-active={mode === "draw"}
      />
    </Popover>
  ) : (
    <Button
      {...btnProps}
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      icon={<HighlightOutlined />}
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
        icon={<IconFont type="icon-eraser" />}
        data-active={mode === "erase"}
      />
    </Popover>
  ) : (
    <Button
      {...btnProps}
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      icon={<IconFont type="icon-eraser" />}
    />
  );
};

const SelectButton = () => {
  const { lasso, mode } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();

  const icon = lasso ? <IconFont type="icon-lasso1" /> : <GatewayOutlined />;

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

const AddButton: FC = () => {
  const drawCtrl = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();
  const { mode, imageSrc } = drawCtrl;

  const getButton = (modeName: DrawCtrl["mode"], icon: ReactNode) => (
    <Button
      key={modeName}
      type={mode === modeName ? "link" : "text"}
      onClick={() => updateDrawCtrl({ mode: modeName })}
      icon={icon}
      data-active={mode === modeName}
    />
  );

  const buttons: Record<string, ReactNode> = {
    text: getButton("text", <IconFont type="icon-text1" />),
    picture: getButton("picture", <PictureOutlined />),
    rect: getButton("rect", <BorderOutlined />),
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
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      getPopupContainer={(e) => e.parentElement!}
    >
      {buttons[mode] ?? <Button type="text" icon={<PlusCircleOutlined />} />}
    </Popover>
  );
};
