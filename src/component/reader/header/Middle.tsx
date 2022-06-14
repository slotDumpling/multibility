import { FC, useMemo, useState, useContext, CSSProperties } from "react";
import { Button, Slider, message, Popover, ButtonProps, Segmented } from "antd";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import {
  defaultWidthList,
  DrawCtrl,
  saveDrawCtrl,
} from "../../../lib/draw/drawCtrl";
import {
  UndoOutlined,
  RedoOutlined,
  GatewayOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import { TagCircle } from "../../menu/SideMenu";
import { colors } from "../../../lib/color";
import { Setter } from "../../../lib/hooks";
import IconFont from "../../ui/IconFont";
import classNames from "classnames";

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
      <div className="br" />
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

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
}> = ({ updateDrawCtrl, drawCtrl }) => {
  const { highlight, color } = drawCtrl;
  const [panelBlur, setPanelBlur] = useState(false);

  return (
    <div className={classNames("pen-panel", { blur: panelBlur })}>
      <div className="pen-status">
        <WidthSelect
          updateDrawCtrl={updateDrawCtrl}
          drawCtrl={drawCtrl}
          setPanelBlur={setPanelBlur}
        />
        <Button
          type="primary"
          ghost
          shape="circle"
          className={classNames("hi-btn", { checked: highlight })}
          icon={<IconFont type="icon-Highlight" />}
          onClick={() => updateDrawCtrl({ highlight: !highlight })}
        />
      </div>
      <ColorSelect
        color={color || ""}
        setColor={(c) => updateDrawCtrl({ color: c })}
      />
    </div>
  );
};

const WidthSelect: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
  setPanelBlur: Setter<boolean>;
}> = ({ updateDrawCtrl, drawCtrl, setPanelBlur }) => {
  const { lineWidth } = drawCtrl;
  const widthList = drawCtrl.widthList ?? defaultWidthList;
  const color = drawCtrl.color ?? "#000000";

  const chosen = useMemo(
    () => Math.max(0, widthList.indexOf(lineWidth ?? 0)),
    [lineWidth, widthList]
  );

  const options = widthList.map((width, index) => ({
    value: index,
    label: (
      <Popover
        onVisibleChange={setPanelBlur}
        trigger={chosen === index ? ["click"] : []}
        placement="bottom"
        content={
          <Slider
            min={5}
            max={100}
            className="ctrl-slider"
            defaultValue={width}
            onAfterChange={(w) => {
              if (widthList.includes(w)) {
                return updateDrawCtrl({ lineWidth: w });
              }
              const newWL = widthList.slice();
              newWL[index] = w;
              updateDrawCtrl({ widthList: newWL, lineWidth: w });
            }}
          />
        }
      >
        <div
          className="circle-wrapper"
          style={{ "--real-size": `calc(0.05vw * ${width})` } as CSSProperties}
        >
          <TagCircle color={color} />
        </div>
      </Popover>
    ),
  }));
  return (
    <Segmented
      className="width-seg"
      value={chosen}
      onChange={(i) =>
        updateDrawCtrl({ lineWidth: widthList[i as number] ?? 5 })
      }
      options={options}
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
