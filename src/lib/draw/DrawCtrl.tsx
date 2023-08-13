import React, {
  FC,
  PropsWithChildren,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from "react";
import { Button, message } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import localforage from "localforage";
import { once } from "lodash";
import { defaultDrawCtrl, DrawCtrl } from "draft-pad";
import "./draw-ctrl.sass";

async function getDrawCtrl() {
  let drawCtrl = await localforage.getItem<DrawCtrl>("DRAW_CTRL");
  if (!drawCtrl) {
    drawCtrl = defaultDrawCtrl;
    await localforage.setItem("DRAW_CTRL", drawCtrl);
  }
  return drawCtrl;
}

async function saveDrawCtrl(drawCtrl: DrawCtrl) {
  await localforage.setItem("DRAW_CTRL", drawCtrl);
}

const DrawCtrlContext = React.createContext({
  drawCtrl: defaultDrawCtrl,
  updateDrawCtrl: (() => {}) as (updated: Partial<DrawCtrl>) => void,
});

export function useDrawCtrl() {
  const { drawCtrl } = useContext(DrawCtrlContext);
  useDebugValue(drawCtrl);
  return drawCtrl;
}

export function useUpdateDrawCtrl() {
  const { updateDrawCtrl } = useContext(DrawCtrlContext);
  return updateDrawCtrl;
}

export const DrawCtrlProvider: FC<PropsWithChildren> = ({ children }) => {
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  useEffect(() => {
    getDrawCtrl().then(setDrawCtrl);
  }, []);

  const updateDrawCtrl = (updated: Partial<DrawCtrl>) => {
    setDrawCtrl((prev) => {
      const newCtrl = { ...prev, ...updated };
      saveDrawCtrl(newCtrl);
      return newCtrl;
    });
  };

  const { finger } = drawCtrl;
  useEffect(() => {
    const detectPen = (e: PointerEvent) => {
      const isPen = e.isPrimary && e.pointerType === "pen";
      if (!isPen || !finger) return;
      showPencilMsg(() => updateDrawCtrl({ finger: false }));
    };
    document.addEventListener("pointerup", detectPen);
    return () => document.removeEventListener("pointerup", detectPen);
  }, [finger]);

  return (
    <DrawCtrlContext.Provider value={{ drawCtrl, updateDrawCtrl }}>
      {children}
    </DrawCtrlContext.Provider>
  );
};

const showPencilMsg = once(async (cb: () => void) => {
  const hide = () => {
    message.destroy("DETECT_PENCIL");
    localforage.setItem("SKIP_PENCIL_MSG", true);
  };
  if (await localforage.getItem("SKIP_PENCIL_MSG")) return;
  message.info({
    content: (
      <>
        Your device supports
        <Button
          shape="round"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            cb();
            hide();
          }}
        >
          Pencil only
        </Button>
        <Button
          size="small"
          type="text"
          shape="circle"
          icon={<CloseOutlined style={{ color: "#999" }} />}
          onClick={hide}
        />
      </>
    ),
    key: "DETECT_PENCIL",
    className: "pencil-msg",
    duration: 0,
  });
});
