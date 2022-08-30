import { FC } from "react";
import { Button, ButtonProps, message, Popover, Segmented } from "antd";
import {
  BulbFilled,
  BulbOutlined,
  UndoOutlined,
  RedoOutlined,
  GatewayOutlined,
  HighlightTwoTone,
  HighlightOutlined,
} from "@ant-design/icons";
import IconFont from "component/IconFont";
import { PenPanel, WidthSelect } from "../tools/PenPanel";
import { useForceLight } from "lib/Dark";
import { useDrawCtrl, useUpdateDrawCtrl } from "lib/draw/DrawCtrl";

const btnProps: ButtonProps = { type: "text", shape: "circle" };

export const HeaderMiddle: FC<{
  handleUndo: () => void;
  handleRedo: () => void;
  undoable: boolean;
  redoable: boolean;
}> = ({ handleUndo, handleRedo, undoable, redoable }) => {
  const { mode, finger } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();
  const [forceLight, setForceLight] = useForceLight();

  return (
    <div className="middle" data-force-light={forceLight}>
      <Button
        {...btnProps}
        icon={<UndoOutlined />}
        onClick={handleUndo}
        disabled={!undoable}
      />
      <Button
        {...btnProps}
        icon={<RedoOutlined />}
        onClick={handleRedo}
        disabled={!redoable}
      />
      <Button
        shape="circle"
        type={finger ? "link" : "text"}
        onClick={() => {
          updateDrawCtrl({ finger: !finger });
          message.open({
            content: finger ? "Pencil only" : "Draw with finger",
            key: "FINGER",
          });
        }}
        icon={<IconFont type="icon-finger" />}
      />
      <Button
        className="force-light-btn"
        {...btnProps}
        icon={forceLight ? <BulbFilled /> : <BulbOutlined />}
        onClick={() => setForceLight((prev) => !prev)}
      />
      <PenButton />
      <EraserButton />
      <Button
        shape="circle"
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

  return mode === "erase" ? (
    <Popover
      content={
        <div className="width-seg-wrapper">
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
      <Button type="link" icon={<IconFont type="icon-eraser" />} />
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
    />
  ) : (
    <Button
      {...btnProps}
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
    />
  );
};
