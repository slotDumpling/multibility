import React, {
  FC,
  PropsWithChildren,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from "react";
import { notification } from "antd";
import localforage from "localforage";
import { debounce, once } from "lodash";
import { defaultDrawCtrl, DrawCtrl } from "draft-pad/dist/lib";
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
    const detectPen = debounce((e: PointerEvent) => {
      const isPen = e.isPrimary && e.pointerType === "pen";
      if (!isPen || !finger) return;
      showPencilMsg(() => updateDrawCtrl({ finger: false }));
    }, 1000);
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
    notification.close("PENCIL_ONLY");
    localforage.setItem("SKIP_PENCIL_ONLY_NOTY", true);
  };

  if (await localforage.getItem("SKIP_PENCIL_ONLY_NOTY")) return;

  notification.info({
    message: "Your device supports Pencil Only",
    description: (
      <div className="pencil-noty-content">
        <div
          className="enable demo-card"
          onClick={() => {
            cb();
            hide();
          }}
        >
          <div className="title">Draw with pencil only</div>
          <div className="stroke"></div>
          <div className="pencil-1 emoji">✍️</div>
          <div className="finger-1 emoji">🫵</div>
        </div>
        <div className="disable demo-card" onClick={hide}>
          <div className="title">Draw with fingers</div>
          <div className="stroke"></div>
          <div className="finger-1 emoji">🫵</div>
          <div className="finger-2 emoji">🫵</div>
        </div>
      </div>
    ),
    icon: <></>,
    duration: 60,
    className: "pencil-noty",
    key: "PENCIL_ONLY",
  });
});
