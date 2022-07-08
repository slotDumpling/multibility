import { DrawCtrl } from "../../lib/draw/DrawCtrl";

export const getCursorStyle = (drawCtrl: DrawCtrl, ratio: number) => {
  const { lineWidth, eraserWidth, mode } = drawCtrl;
  const size = ratio * (mode === "erase" ? eraserWidth : lineWidth);
  if (size < 5) return "crosshair";
  const half = size / 2;
  return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23FFF7" width="${size}" height="${size}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>') ${half} ${half}, auto`;
};
