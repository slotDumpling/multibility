import { FC, useContext } from "react";
import { Button, message, Popover, ButtonProps } from "antd";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import { DrawCtrl, saveDrawCtrl } from "../../../lib/draw/drawCtrl";
import {
  BulbFilled,
  BulbOutlined,
  UndoOutlined,
  RedoOutlined,
  GatewayOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import IconFont from "../../ui/IconFont";
import { PenPanel, WidthSelect } from "../tools/PenPanel";

export const HeaderMiddle = () => {
  const { stateSet, drawCtrl, forceLight } = useContext(ReaderStateCtx);
  const { setDrawCtrl, handleUndo, handleRedo, setForceLight } =
    useContext(ReaderMethodCtx);
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
      <Button
        type="text"
        shape="circle"
        icon={forceLight ? <BulbFilled /> : <BulbOutlined />}
        onClick={() => setForceLight((prev) => !prev)}
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
    shape: "circle",
    icon: <HighlightOutlined />,
  };
  return mode === "draw" ? (
    <Popover
      content={<PenPanel updateDrawCtrl={updateDrawCtrl} drawCtrl={drawCtrl} />}
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
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

const EraserButton: FC<{
  updateDrawCtrl: (updated: Partial<DrawCtrl>) => void;
}> = ({ updateDrawCtrl }) => {
  const { drawCtrl } = useContext(ReaderStateCtx);

  const btnProps: ButtonProps = {
    shape: "circle",
    icon: <IconFont type="icon-eraser" />,
  };

  return drawCtrl.mode === "erase" ? (
    <Popover
      content={
        <WidthSelect
          drawCtrl={drawCtrl}
          updateDrawCtrl={updateDrawCtrl}
          field="eraserWidth"
        />
      }
      trigger="click"
      placement="bottom"
      getPopupContainer={(e) => e.parentElement!}
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
