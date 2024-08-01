import { FC } from "react";
import { Button, Popover, Switch } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { useForceLight } from "lib/Dark";
import { useDrawCtrl, useUpdateDrawCtrl } from "lib/draw/DrawCtrl";
import { useMediaQuery } from "react-responsive";
import { MoreOutlined } from "@ant-design/icons";
import "./options.sass";

export const OptionButton: FC<{
  placement?: TooltipPlacement;
}> = ({ placement }) => {
  const { finger } = useDrawCtrl();
  const updateDrawCtrl = useUpdateDrawCtrl();
  const [forceLight, setForceLight] = useForceLight();
  const isLight = useMediaQuery({ query: "(prefers-color-scheme: light)" });

  const options = (
    <div className="reader-options">
      <div className="other-option">
        <span>Pencil only</span>
        <Switch
          size="small"
          checked={!finger}
          onChange={(v) => updateDrawCtrl({ finger: !v })}
        />
      </div>
      <div className="other-option">
        <span>Light mode</span>
        <Switch
          size="small"
          checked={forceLight || isLight}
          disabled={isLight}
          onChange={setForceLight}
        />
      </div>
    </div>
  );

  return (
    <Popover
      getPopupContainer={(e) => e.parentElement!}
      trigger="click"
      content={options}
      placement={placement}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        className="reader-option-btn"
      />
    </Popover>
  );
};
