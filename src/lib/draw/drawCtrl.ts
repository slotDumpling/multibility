import localforage from "localforage";

export interface DrawCtrl {
  erasing: boolean;
  finger: boolean;
  even: boolean;
  lineWidth: number;
  color: string;
  highlight: boolean;
}

export const defaultDrawCtrl: DrawCtrl = {
  erasing: false,
  finger: false,
  even: true,
  lineWidth: 10,
  color: "#000000",
  highlight: false,
};

export async function getDrawCtrl() {
  console.log("called get drawctrl");
  let drawCtrl = (await localforage.getItem("DRAW_CTRL")) as DrawCtrl | null;
  if (!drawCtrl) {
    drawCtrl = defaultDrawCtrl;
    await localforage.setItem("DRAW_CTRL", drawCtrl);
  }
  return drawCtrl;
}

export async function saveDrawCtrl(drawCtrl: DrawCtrl) {
  console.log("called save drawctrl");
  await localforage.setItem("DRAW_CTRL", drawCtrl);
}
