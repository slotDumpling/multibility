import { createVirtualCanvas } from "lib/draw/canvas";
import { DrawCtrl } from "lib/draw/DrawCtrl";
import rotateImg2x from "./rotate2x.png";
import rotateImg1x from "./rotate1x.png";

export const getCircleCursor = (drawCtrl: DrawCtrl, ratio: number) => {
  const { lineWidth, eraserWidth, mode } = drawCtrl;
  const size = ratio * (mode === "erase" ? eraserWidth : lineWidth);
  if (size < 5) return "crosshair";
  const half = size / 2;
  const double = size * 2;

  const getSvg = (size: number) =>
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23DDD7" width="${size}" height="${size}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>`;

  const img1x = getSvg(size);
  const img2x = getSvg(double);

  return `-webkit-image-set(url('${img1x}')1x, url('${img2x}')2x) ${half} ${half}, crosshair`;
};

const rotateCursorFactory = (src: string, size: number) => {
  const cache = new Map<number, string>();
  const half = size / 2;
  const { canvas, context } = createVirtualCanvas(size, size);
  const image = new Image();
  image.src = src;
  return (angle: number) => {
    angle = Math.round(angle / 10) * 10;
    const cached = cache.get(angle);
    if (cached) return cached;
    context.translate(half, half);
    context.rotate((angle * Math.PI) / 180);
    context.drawImage(image, -half, -half);
    const data = canvas.toDataURL();
    context.clearRect(-half, -half, size, size);
    context.resetTransform();
    cache.set(angle, data);
    return data;
  };
};

const getRotateCursor1x = rotateCursorFactory(rotateImg1x, 32);
const getRotateCursor2x = rotateCursorFactory(rotateImg2x, 64);

export const getRotateCurcor = (angle: number) => {
  const data1x = getRotateCursor1x(angle);
  const data2x = getRotateCursor2x(angle);
  return `-webkit-image-set(url(${data1x})1x, url(${data2x})2x) 16 16, auto`;
};
