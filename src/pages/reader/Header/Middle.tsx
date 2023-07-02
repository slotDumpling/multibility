import { FC } from "react";
import { Button, ButtonProps, Popover, Segmented, Switch, Tooltip } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  GatewayOutlined,
  HighlightTwoTone,
  HighlightOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import IconFont from "component/IconFont";
import { PenPanel, WidthSelect } from "../tools/PenPanel";
import { useDrawCtrl, useUpdateDrawCtrl } from "lib/draw/DrawCtrl";

const btnProps: ButtonProps = { type: "text" };

export const HeaderMiddle: FC<{
  handleUndo: () => void;
  handleRedo: () => void;
  undoable: boolean;
  redoable: boolean;
}> = ({ handleUndo, handleRedo, undoable, redoable }) => {
  const { mode } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();

  return (
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
      <Button
        type={mode === "text" ? "link" : "text"}
        onClick={() => updateDrawCtrl({ mode: "text" })}
        icon={<IconFont type="icon-text1" />}
      />
      <SelectButton />
    </div>
  );
};

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
        className="with-secondary"
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
  const { mode, pixelEraser, globalEraser } = drawCtrl;
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

  const globalSwitch = (
    <div className="global-switch" data-pixel-on={pixelEraser}>
      {pixelEraser || (
        <>
          <span>
            Global
            <Tooltip className="hint" title="Turn on to erase others' strokes.">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          <Switch
            size="small"
            checked={globalEraser}
            onChange={(v) => updateDrawCtrl({ globalEraser: v })}
          />
        </>
      )}
    </div>
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
          {globalSwitch}
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
        className="with-secondary"
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
      className="with-secondary"
    />
  ) : (
    <Button
      {...btnProps}
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
    />
  );
};
