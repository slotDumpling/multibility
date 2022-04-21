import localforage from "localforage";

export type CtrlMode = "draw" | "erase" | "select" | "selected" | "delete";

export interface DrawCtrl {
  finger: boolean;
  lineWidth: number;
  eraserWidth: number;
  color: string;
  highlight: boolean;
}

export const defaultDrawCtrl: DrawCtrl = {
  finger: false,
  lineWidth: 10,
  eraserWidth: 10,
  color: "#000000",
  highlight: false,
};

export async function getDrawCtrl() {
  let drawCtrl = (await localforage.getItem("DRAW_CTRL")) as DrawCtrl | null;
  if (!drawCtrl) {
    drawCtrl = defaultDrawCtrl;
    await localforage.setItem("DRAW_CTRL", drawCtrl);
  }
  return drawCtrl;
}

export async function saveDrawCtrl(drawCtrl: DrawCtrl) {
  await localforage.setItem("DRAW_CTRL", drawCtrl);
}
