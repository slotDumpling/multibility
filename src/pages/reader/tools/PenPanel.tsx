import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { defaultWidthList, DrawCtrl } from "draft-pad/dist/lib";
import { ColorCirle } from "component/ColorCircle";
import { Popover, Segmented, Slider, Tooltip } from "antd";
import { allColors } from "lib/color";
import { Setter, useEvent } from "lib/hooks";
import IconFont from "component/IconFont";
import { List } from "immutable";
import { WIDTH } from "lib/draw/DrawConst";
import "./pen-panel.sass";

export const PenPanel: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
  drawCtrl: Partial<DrawCtrl>;
}> = ({ updateDrawCtrl, drawCtrl }) => {
  const { highlight, color, mode } = drawCtrl;
  const [panelBlur, setPanelBlur] = useState(false);

  return (
    <div
      className="pen-panel"
      data-blur={panelBlur}
      data-hi={highlight}
      data-mode={mode}
    >
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

  const chosenIndex = useMemo(
    () => widthList.indexOf(currWidth ?? -1),
    [currWidth, widthList]
  );

  const [popShow, setPopShow] = useState(List([false, false, false, false]));
  setPanelBlur = useEvent(setPanelBlur);
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
          trigger={chosenIndex === index ? ["click"] : []}
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
            data-chosen={chosenIndex === index}
            style={realSizeStyle(width)}
          >
            <ColorCirle className={"width-circle " + field} color={color} />
          </div>
        </Popover>
      ),
    })),
  ];

  return (
    <Segmented
      className="width-seg"
      value={chosenIndex}
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
      <Tooltip title="Highlighter" placement="bottom">
        <div className="hi-switch">
          <IconFont type="icon-Highlight" />
        </div>
      </Tooltip>
    </label>
  );
};

export const ColorSelect: FC<{
  color: string;
  setColor: (color: string) => void;
}> = ({ setColor, color }) => (
  <div className="color-select">
    {allColors.map((c) => (
      <div
        key={c}
        data-color={c}
        data-selected={color === c}
        className="circle"
        style={{ backgroundColor: c, borderColor: c }}
        onClick={() => setColor(c)}
      />
    ))}
  </div>
);
