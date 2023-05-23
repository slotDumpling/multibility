import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { defaultWidthList, DrawCtrl } from "lib/draw/DrawCtrl";
import { ColorCirle } from "component/ColorCircle";
import { WIDTH } from "lib/draw/DrawState";
import { Popover, Segmented, Slider } from "antd";
import { allColors } from "lib/color";
import { Setter } from "lib/hooks";
import IconFont from "component/IconFont";
import { List } from "immutable";
import "./pen-panel.sass";

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
}> = ({ updateDrawCtrl, drawCtrl }) => {
  const { highlight, color } = drawCtrl;
  const [panelBlur, setPanelBlur] = useState(false);

  return (
    <div className="pen-panel" data-blur={panelBlur} data-hi={highlight}>
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
    () => widthList.indexOf(currWidth ?? -1),
    [currWidth, widthList]
  );

  const [popShow, setPopShow] = useState(List([false, false, false, false]));
  useEffect(() => {
    if (popShow.includes(true)) setPanelBlur(true);
    else setPanelBlur(false);
  }, [popShow, setPanelBlur]);

  // temp: ugly Implementation
  const [widthRatio] = useState(() => {
    const section = document.querySelector("section.note-page");
    const sw = section?.getBoundingClientRect().width ?? 0;
    const bw = document.body.getBoundingClientRect().width;
    return sw / bw;
  });

  const realSizeStyle = (width: number) =>
    ({
      "--real-size": `calc(${100 / WIDTH}vw * ${width} * ${widthRatio})`,
    } as CSSProperties);

  const options = [
    { value: -1, label: null },
    ...widthList.map((width, index) => ({
      value: index,
      label: (
        <Popover
          open={popShow.get(index)}
          onOpenChange={(v) => setPopShow((prev) => prev.set(index, v))}
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
          <div className="circle-wrapper" style={realSizeStyle(width)}>
            <ColorCirle className={"width-circle " + field} color={color} />
          </div>
        </Popover>
      ),
    })),
  ];

  return (
    <Segmented
      className="width-seg"
      value={chosen}
      options={options}
      onChange={(i) => updateDrawCtrl({ [field]: widthList[+i] ?? 10 })}
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
}> = ({ setColor, color }) => (
  <div className="color-select">
    {allColors.map((c) => (
      <label key={c}>
        <input
          checked={color === c}
          type="radio"
          name="color"
          onChange={(e) => e.target.checked && setColor(c)}
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
