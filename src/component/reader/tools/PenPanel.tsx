import { CSSProperties, FC, useMemo, useState } from "react";
import { defaultWidthList, DrawCtrl } from "../../../lib/draw/drawCtrl";
import { Button, Popover, Segmented, Slider } from "antd";
import { ColorCirle } from "../../widgets/ColorCircle";
import { ColorSelect } from "../header/Middle";
import { Setter } from "../../../lib/hooks";
import IconFont from "../../ui/IconFont";
import classNames from "classnames";
import "./penPanel.sass";

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
          <ColorCirle className="width-circle" color={color} />
        </div>
      </Popover>
    ),
  }));

  return (
    <Segmented
      className="width-seg"
      value={chosen}
      onChange={(i) => {
        if (typeof i !== "number") return;
        updateDrawCtrl({ lineWidth: widthList[i] ?? 5 });
      }}
      options={options}
    />
  );
};
