import localforage from "localforage";

export interface DrawCtrl {
  mode: "draw" | "erase" | "select"
  finger: boolean;
  lineWidth: number;
  eraserWidth: number;
  color: string;
  highlight: boolean;
}

export const defaultDrawCtrl: Readonly<DrawCtrl> = {
  mode: 'draw',
  finger: true,
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
