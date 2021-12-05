import React, {
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./draw.css";
import { iOSTouch } from "./lib/draw";
import { Drawer } from "./lib/drawer";
import { DrawStateMethod, SetDrawState } from "./lib/DrawState";

export default function Drawinput({
  setDrawState,
  method,
  finger,
  even,
  lineWidth,
  width,
  height,
}: {
  setDrawState: SetDrawState;
  method: DrawStateMethod;
  finger: boolean;
  even: boolean;
  lineWidth: number;
  width: number;
  height: number;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D>();
  const clientWidth = useRef(width);
  const clientHeight = useRef(height);
  let [minX, minY, maxX, maxY] = [width, height, 0, 0];

  const [isDrawing, setIsDrawing] = useState(false);
  const drawer = useRef<Drawer>();

  useEffect(() => {
    if (!canvasEl.current) return;
    canvasEl.current.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    const ctx = canvasEl.current.getContext("2d");
    if (!ctx) return;
    context.current = ctx;
    updateClientSize();
  }, []);

  useEffect(() => {
    if (isDrawing === false) {
      context.current?.clearRect(0, 0, width, height);
    }
  }, [isDrawing, width, height]);

  function getPosition(
    e: iOSTouch | MouseEvent<HTMLCanvasElement>
  ): [number, number] {
    const x = (e.clientX / clientWidth.current) * width;
    const y = (e.clientY / clientHeight.current) * height;
    [minX, minY, maxX, maxY] = [
      Math.floor(Math.max(Math.min(minX, x - lineWidth), 0)),
      Math.floor(Math.max(Math.min(minY, y - lineWidth), 0)),
      Math.ceil(Math.min(Math.max(maxX, x + lineWidth), width)),
      Math.ceil(Math.min(Math.max(maxY, y + lineWidth), height)),
    ];
    return [x, y];
  }

  function updateClientSize() {
    if (!canvasEl.current) return;
    clientWidth.current = canvasEl.current.clientWidth;
    clientHeight.current = canvasEl.current.clientHeight;
  }

  function handleTouchStart(e: TouchEvent<HTMLCanvasElement>) {
    if (!context.current) return;

    setIsDrawing(true);
    updateClientSize();

    drawer.current = new Drawer(context.current);

    const touch = e.touches[0] as iOSTouch;
    if (!finger && touch.touchType === "direct") {
      return;
    }
    const pressure = (touch.force || 0) * lineWidth;
    const [x, y] = getPosition(touch);
    const lineWidth_ = even
      ? lineWidth
      : drawer.current.computeLineWidth(pressure);

    const newP = {
      x,
      y,
      lineWidth: lineWidth_,
    };

    drawer.current.drawBegin(newP);
  }

  function handleMouseStart(e: MouseEvent<HTMLCanvasElement>) {
    if (!context.current) return;

    setIsDrawing(true);
    updateClientSize();

    const [x, y] = getPosition(e);

    drawer.current = new Drawer(context.current);
    const newP = { x, y, lineWidth };
    drawer.current.drawBegin(newP);
  }

  function handleTouchMove(e: TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing || !drawer.current) return;

    const touch = e.touches[0] as iOSTouch;
    if (!finger && touch.touchType === "direct") {
      return;
    }
    const pressure = (touch.force || 0) * lineWidth;
    const [x, y] = getPosition(touch);

    const lineWidth_ = even
      ? lineWidth
      : drawer.current.computeLineWidth(pressure);

    const newP = {
      x,
      y,
      lineWidth: lineWidth_,
    };
    drawer.current.drawCurve(newP);
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !drawer.current) return;

    const [x, y] = getPosition(e);
    const newP = { x, y, lineWidth };
    drawer.current.drawCurve(newP);
  }

  function handleEnd() {
    const ctx = context.current;
    if (!isDrawing || !drawer.current || !ctx) return;

    const points = drawer.current.points;

    console.time("stroke");

    const updateInput = () => {
      const imageData = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);
      setDrawState((prev) =>
        method(prev, { imageData, minX, minY, maxX, maxY }, points)
      );
      setIsDrawing(false);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(updateInput);
    });
  }

  return (
    <canvas
      width={width}
      height={height}
      ref={canvasEl}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onTouchEnd={handleEnd}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    />
  );
}
