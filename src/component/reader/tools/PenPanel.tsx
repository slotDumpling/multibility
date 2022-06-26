import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { defaultWidthList, DrawCtrl } from "../../../lib/draw/drawCtrl";
import { Popover, Segmented, Slider } from "antd";
import { ColorCirle } from "../../widgets/ColorCircle";
import { allColors } from "../../../lib/color";
import { Setter } from "../../../lib/hooks";
import IconFont from "../../ui/IconFont";
import { List } from "immutable";
import "./penPanel.sass";

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
}> = ({ updateDrawCtrl, drawCtrl }) => {
  const { highlight, color } = drawCtrl;
  const [panelBlur, setPanelBlur] = useState(false);

  return (
    <div className="pen-panel" data-blur={panelBlur}>
      <div className="pen-status">
        <WidthSelect
          updateDrawCtrl={updateDrawCtrl}
          drawCtrl={drawCtrl}
          setPanelBlur={setPanelBlur}
        />
        <HighlightSwitch checked={highlight} updateDrawCtrl={updateDrawCtrl} />
      </div>
      <ColorSelect
        color={color || ""}
        setColor={(c) => updateDrawCtrl({ color: c })}
      />
    </div>
  );
};

export const WidthSelect: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
  setPanelBlur?: Setter<boolean>;
  field?: "lineWidth" | "eraserWidth";
}> = ({
  updateDrawCtrl,
  drawCtrl,
  setPanelBlur = () => {},
  field = "lineWidth",
}) => {
  const currWidth = drawCtrl[field];
  const widthList = drawCtrl.widthList ?? defaultWidthList;
  const color = field === "lineWidth" ? drawCtrl.color ?? "#aaa" : "#aaa";

  const chosen = useMemo(
    () => Math.max(0, widthList.indexOf(currWidth ?? 0)),
    [currWidth, widthList]
  );

  const [popShow, setPopShow] = useState(List([false, false, false, false]));
  useEffect(() => {
    if (popShow.includes(true)) setPanelBlur(true);
    else setPanelBlur(false);
  }, [popShow, setPanelBlur]);

  const options = widthList.map((width, index) => ({
    value: index,
    label: (
      <Popover
        visible={popShow.get(index)}
        onVisibleChange={(v) => setPopShow((prev) => prev.set(index, v))}
        trigger={chosen === index ? ["click"] : []}
        placement="bottom"
        destroyTooltipOnHide
        content={
          <Slider
            min={5}
            max={100}
            className="ctrl-slider"
            defaultValue={width}
            onAfterChange={(w) => {
              if (widthList.includes(w)) {
                setPopShow((prev) => prev.set(index, false));
                return updateDrawCtrl({ [field]: w });
              }
              const newWL = widthList.slice();
              newWL[index] = w;
              updateDrawCtrl({ widthList: newWL, [field]: w });
            }}
          />
        }
      >
        <div
          className="circle-wrapper"
          style={{ "--real-size": `calc(0.05vw * ${width})` } as CSSProperties}
        >
          <ColorCirle className={"width-circle " + field} color={color} />
        </div>
      </Popover>
    ),
  }));

  return (
    <Segmented
      className="width-seg"
      value={chosen}
      options={options}
      onChange={(i) => updateDrawCtrl({ [field]: widthList[+i] ?? 5 })}
    />
  );
};

const HighlightSwitch: FC<{
  checked?: boolean;
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ checked = false, updateDrawCtrl }) => {
  return (
    <label className="hi-wrapper">
      <input
        type="checkbox"
        name="highlight"
        checked={checked}
        onChange={(e) => updateDrawCtrl({ highlight: e.target.checked })}
      />
      <div className="hi-switch">
        <IconFont type="icon-Highlight" />
      </div>
    </label>
  );
};

export const ColorSelect: FC<{
  color: string;
  setColor: (color: string) => void;
}> = ({ setColor, color }) => {
  return (
    <div className="color-select">
      {allColors.map((c) => (
        <label key={c}>
          <input
            checked={color === c}
            type="radio"
            name="color"
            onChange={() => setColor(c)}
          />
          <div
            data-color={c}
            className="circle"
            style={{ backgroundColor: c, borderColor: c }}
          />
        </label>
      ))}
    </div>
  );
};
