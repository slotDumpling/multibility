import { FC, useContext } from "react";
import { Button, message, Popover, ButtonProps, Segmented } from "antd";
import { ReaderStateCtx } from "../Reader";
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

export const HeaderMiddle: FC<{
  handleUndo: () => void;
  handleRedo: () => void;
}> = ({ handleUndo, handleRedo }) => {
  const { stateSet } = useContext(ReaderStateCtx);
  const { mode, finger } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();
  const [forceLight, setForceLight] = useForceLight();

  return (
    <div className="middle">
      <Button
        type="text"
        icon={<UndoOutlined />}
        onClick={handleUndo}
        disabled={!stateSet?.isUndoable()}
      />
      <Button
        type="text"
        icon={<RedoOutlined />}
        onClick={handleRedo}
        disabled={!stateSet?.isRedoable()}
      />
      <Button
        type={finger ? "link" : "text"}
        onClick={() => {
          updateDrawCtrl({ finger: !finger });
          message.destroy("FINGER");
          message.open({
            content: finger ? "Pencil only" : "Draw with finger",
            key: "FINGER",
          });
        }}
        icon={<IconFont type="icon-finger" />}
      />
      <Button
        className="force-light-btn"
        type="text"
        icon={forceLight ? <BulbFilled /> : <BulbOutlined />}
        onClick={() => setForceLight((prev) => !prev)}
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
      />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      icon={<HighlightOutlined />}
    />
  );
};

const EraserButton = () => {
  const drawCtrl = useDrawCtrl();
  const { mode, pixelEraser } = drawCtrl;
  const updateDrawCtrl = useUpdateDrawCtrl();

  const btnProps: ButtonProps = {
    shape: "circle",
    icon: <IconFont type="icon-eraser" />,
  };

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
      <Button type="link" {...btnProps} />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      {...btnProps}
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
      type="text"
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
    />
  );
};
