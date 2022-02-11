import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { iOSTouch } from "../../lib/draw/draw";
import { DualDrawer } from "../../lib/draw/drawer";
import { DrawState, DrawStateMethod, SetDrawState } from "../../lib/draw/DrawState";

export default function Drawinput({
  drawState,
  setDrawState,
  method,
  finger,
  even,
  lineWidth,
}: {
  drawState: DrawState;
  setDrawState: SetDrawState;
  method: DrawStateMethod;
  finger: boolean;
  even: boolean;
  lineWidth: number;
}) {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const clientWidth = useRef(width);
  const clientHeight = useRef(height);

  const isDrawing = useRef(false);
  const drawer = useRef<DualDrawer>();

  useEffect(() => {
    const cvs = getCanvasEl();

    const touchPrevent = (e: globalThis.TouchEvent) => {
      if (!finger && isFinger(e)) {
        return;
      }
      e.preventDefault();
    };

    cvs.addEventListener("touchstart", touchPrevent, {
      passive: false,
    });

    return () => {
      cvs.removeEventListener("touchstart", touchPrevent);
    };
  }, [finger]);

  useEffect(updateClientSize, []);

  useEffect(() => {
    getContext().clearRect(0, 0, width, height);
  }, [drawState, width, height]);

  function getCanvasEl() {
    if (!canvasEl.current) {
      throw Error("can't get canvas element");
    }
    return canvasEl.current;
  }

  function getContext() {
    const context = getCanvasEl().getContext("2d");
    if (!context) {
      throw Error("can't get canvas context");
    }
    return context;
  }

  function getPosition(
    e: iOSTouch | MouseEvent<HTMLCanvasElement>
  ): [number, number] {
    const clientRect = getCanvasEl().getBoundingClientRect();
    const offsetX = e.clientX - clientRect.left;
    const offsetY = e.clientY - clientRect.top;
    const x = (offsetX / clientWidth.current) * width;
    const y = (offsetY / clientHeight.current) * height;
    return [x, y];
  }

  function updateClientSize() {
    clientWidth.current = getCanvasEl().clientWidth;
    clientHeight.current = getCanvasEl().clientHeight;
  }

  function isFinger(e: TouchEvent<HTMLCanvasElement> | globalThis.TouchEvent) {
    const touch = e.touches[0] as iOSTouch;
    return touch.touchType === "direct";
  }

  function handleTouchStart(e: TouchEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    updateClientSize();

    drawer.current = new DualDrawer(getContext(), width, height);

    const touch = e.touches[0] as iOSTouch;
    if (!finger && isFinger(e)) {
      return;
    }
    const pressure = (touch.force ?? 0) * lineWidth;
    const [x, y] = getPosition(touch);
    const lw = even
      ? lineWidth
      : drawer.current.computeLineWidth(pressure);

    const newP = { x, y, lineWidth: lw };

    drawer.current.drawBegin(newP);
  }

  function handleMouseStart(e: MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    updateClientSize();

    const [x, y] = getPosition(e);

    drawer.current = new DualDrawer(getContext(), width, height);
    const newP = { x, y, lineWidth };
    drawer.current.drawBegin(newP);
  }

  function handleTouchMove(e: TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !drawer.current) return;

    const touch = e.touches[0] as iOSTouch;
    if (!finger && touch.touchType === "direct") {
      return;
    }
    const pressure = (touch.force ?? 0) * lineWidth;
    const [x, y] = getPosition(touch);

    const lw = even
      ? lineWidth
      : drawer.current.computeLineWidth(pressure);

    const newP = { x, y, lineWidth: lw };
    drawer.current.drawCurve(newP);
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !drawer.current) return;

    const [x, y] = getPosition(e);
    const newP = { x, y, lineWidth };
    drawer.current.drawCurve(newP);
  }

  function handleEnd() {
    const d = drawer.current;
    if (!isDrawing.current || !d) return;

    const points = d.points;

    const updateInput = () => {
      isDrawing.current = false;
      setDrawState((prev) => method(prev, d.getMirrorImageData(), points));
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
