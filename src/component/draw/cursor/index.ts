import { createVirtualCanvas } from "../../../lib/draw/canvas";
import { DrawCtrl } from "../../../lib/draw/DrawCtrl";
import rotateImg from "./rotate.png";

export const getCircleCursor = (drawCtrl: DrawCtrl, ratio: number) => {
  const { lineWidth, eraserWidth, mode } = drawCtrl;
  const size = ratio * (mode === "erase" ? eraserWidth : lineWidth);
  if (size < 5) return "crosshair";
  const half = size / 2;
  return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23FFF7" width="${size}" height="${size}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>') ${half} ${half}, auto`;
};

const getRotateCursorImage = (() => {
  const cache = new Map<number, string>();
  const { canvas, context } = createVirtualCanvas(30, 30);
  const image = new Image();
  image.src = rotateImg;
  return (angle: number) => {
    angle = Math.round(angle / 10) * 10;
    const cached = cache.get(angle);
    if (cached) return cached;
    context.translate(15, 15);
    context.rotate((angle * Math.PI) / 180);
    context.drawImage(image, -15, -15);
    const data = canvas.toDataURL();
    context.clearRect(-15, -15, 30, 30);
    context.resetTransform();
    cache.set(angle, data);
    return data;
  };
})();

export const getRotateCurcor = (angle: number) => {
  return `url(${getRotateCursorImage(angle)}) 15 15, auto`;
};

export const getResizeCursor = (angle: number) => {
  return angle > 90 ? "nesw-resize" : "nwse-resize";
};
