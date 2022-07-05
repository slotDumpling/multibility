import localforage from "localforage";
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

export async function getDrawCtrl() {
  let drawCtrl = await localforage.getItem<DrawCtrl>("DRAW_CTRL");
  if (!drawCtrl) {
    drawCtrl = defaultDrawCtrl;
    await localforage.setItem("DRAW_CTRL", drawCtrl);
  }
  return drawCtrl;
}

export async function saveDrawCtrl(drawCtrl: DrawCtrl) {
  await localforage.setItem("DRAW_CTRL", drawCtrl);
}
