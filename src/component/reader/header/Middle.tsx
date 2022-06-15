import { FC, useState, useContext, CSSProperties } from "react";
import { Button, Slider, message, Popover, ButtonProps } from "antd";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import { DrawCtrl, saveDrawCtrl } from "../../../lib/draw/drawCtrl";
import {
  UndoOutlined,
  RedoOutlined,
  GatewayOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import { colors } from "../../../lib/color";
import IconFont from "../../ui/IconFont";
import { PenPanel } from "../tools/PenPanel";

export const HeaderMiddle = () => {
  const { stateSet, drawCtrl } = useContext(ReaderStateCtx);
  const { setDrawCtrl, handleUndo, handleRedo } = useContext(ReaderMethodCtx);
  const { mode, finger } = drawCtrl;

  const updateDrawCtrl = (updated: Partial<DrawCtrl>) => {
    setDrawCtrl((prev) => {
      const newCtrl = { ...prev, ...updated };
      saveDrawCtrl(newCtrl);
      return newCtrl;
    });
  };

  return (
    <div className="middle">
      <Button
        type="text"
        shape="circle"
        icon={<UndoOutlined />}
        onClick={handleUndo}
        disabled={!stateSet?.isUndoable()}
      />
      <Button
        type="text"
        shape="circle"
        icon={<RedoOutlined />}
        onClick={handleRedo}
        disabled={!stateSet?.isRedoable()}
      />
      <Button
        className="finger"
        type={finger ? "default" : "text"}
        shape="circle"
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
      <PenButton updateDrawCtrl={updateDrawCtrl} />
      <EraserButton updateDrawCtrl={updateDrawCtrl} />
      <Button
        type={mode === "text" ? "default" : "text"}
        shape="circle"
        onClick={() => updateDrawCtrl({ mode: "text" })}
        icon={<IconFont type="icon-text1" />}
      />
      <SelectButton updateDrawCtrl={updateDrawCtrl} />
    </div>
  );
};

const PenButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const { drawCtrl } = useContext(ReaderStateCtx);
  const { mode } = drawCtrl;

  const btnProps: ButtonProps = {
    className: "pen",
    shape: "circle",
    icon: <HighlightOutlined />,
  };
  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} drawCtrl={drawCtrl} />}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button type="default" {...btnProps} />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "draw" })}
      {...btnProps}
    />
  );
};

export const ColorSelect: FC<{
  color: string;
  setColor: (color: string) => void;
}> = ({ setColor, color }) => {
  return (
    <div className="color-select">
      {colors.map((c) => (
        <label key={c}>
          <input
            checked={color === c}
            type="radio"
            name="color"
            onChange={() => setColor(c)}
          />
          <div
            className="circle"
            style={{ "--circle-color": c } as CSSProperties}
          ></div>
        </label>
      ))}
    </div>
  );
};

const EraserButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const {
    drawCtrl: { eraserWidth, mode },
  } = useContext(ReaderStateCtx);
  const [tempEraserWidth, setTempEraserWidth] = useState(eraserWidth);

  const slider = (
    <Slider
      className="ctrl-slider"
      min={5}
      max={100}
      defaultValue={tempEraserWidth}
      onChange={setTempEraserWidth}
      onAfterChange={(eraserWidth) => updateDrawCtrl({ eraserWidth })}
    />
  );

  const btnProps: ButtonProps = {
    shape: "circle",
    icon: <IconFont type="icon-eraser" />,
  };

  return mode === "erase" ? (
    <Popover
      content={slider}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e}
      destroyTooltipOnHide
    >
      <Button type="default" {...btnProps} />
    </Popover>
  ) : (
    <Button
      type="text"
      onClick={() => updateDrawCtrl({ mode: "erase" })}
      {...btnProps}
    />
  );
};

const SelectButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const {
    drawCtrl: { lasso, mode },
  } = useContext(ReaderStateCtx);

  const icon = lasso ? <IconFont type="icon-lasso1" /> : <GatewayOutlined />;

  return mode === "select" ? (
    <Button
      type="default"
      shape="circle"
      icon={icon}
      onClick={() => updateDrawCtrl({ lasso: !lasso })}
    />
  ) : (
    <Button
      type="text"
      shape="circle"
      icon={icon}
      onClick={() => updateDrawCtrl({ mode: "select" })}
    />
  );
};
