import localforage from "localforage";
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from "react";
export interface DrawCtrl {
  mode: "draw" | "erase" | "select" | "text";
  finger: boolean;
  lineWidth: number;
  eraserWidth: number;
  color: string;
  highlight: boolean;
  lasso: boolean;
  pixelEraser: boolean;
  widthList: number[];
}

export const defaultWidthList = [10, 20, 30, 50];
export const defaultDrawCtrl: Readonly<DrawCtrl> = {
  mode: "draw",
  finger: true,
  lineWidth: 10,
  eraserWidth: 10,
  color: "#000000",
  highlight: false,
  lasso: true,
  pixelEraser: false,
  widthList: defaultWidthList,
};

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
  return (
    <DrawCtrlContext.Provider value={{ drawCtrl, updateDrawCtrl }}>
      {children}
    </DrawCtrlContext.Provider>
  );
};
