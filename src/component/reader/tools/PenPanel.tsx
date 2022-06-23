import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { defaultWidthList, DrawCtrl } from "../../../lib/draw/drawCtrl";
import { Button, Popover, Segmented, Slider } from "antd";
import { ColorCirle } from "../../widgets/ColorCircle";
import { ColorSelect } from "../header/Middle";
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
        <Button
          type="primary"
          ghost
          shape="circle"
          className="hi-btn"
          data-checked={highlight}
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
  const color = field === "lineWidth" ? drawCtrl.color ?? "#0003" : "#0003";

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
          <ColorCirle className="width-circle" color={color} />
        </div>
      </Popover>
    ),
  }));

  return (
    <Segmented
      className="width-seg"
      value={chosen}
      options={options}
      onChange={(i) => {
        if (typeof i !== "number") return;
        updateDrawCtrl({ [field]: widthList[i] ?? 5 });
      }}
    />
  );
};
