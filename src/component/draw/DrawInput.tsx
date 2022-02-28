import React, { MouseEvent, TouchEvent, useEffect, useRef } from "react";
import { iOSTouch, isFinger } from "../../lib/touch/touch";
import { Drawer } from "../../lib/draw/drawer";
import { Eraser } from "../../lib/draw/eraser";
import { DrawState, SetDrawState } from "../../lib/draw/DrawState";

export default function DrawInput({
  drawState,
  setDrawState,
  finger,
  even,
  lineWidth,
  erasing,
  eraser,
}: {
  drawState: DrawState;
  setDrawState: SetDrawState;
  finger: boolean;
  even: boolean;
  lineWidth: number;
  erasing: boolean;
  eraser: Eraser;
}) {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const clientWidth = useRef(width);
  const clientHeight = useRef(height);

  const isDrawing = useRef(false);
  const drawer = useRef<Drawer>();
  const erased = useRef<Set<string>>(new Set());

  useEffect(updateClientSize, []);

  useEffect(() => {
    const cvs = getCanvasEl();

    const touchPrevent = (e: globalThis.TouchEvent) => {
      if (!finger && isFinger(e)) return;
      e.preventDefault();
    };

    cvs.addEventListener("touchstart", touchPrevent, {
      passive: false,
    });

    return () => {
      cvs.removeEventListener("touchstart", touchPrevent);
    };
  }, [finger]);

  useEffect(() => {
    getContext().clearRect(0, 0, width, height);
  }, [drawState, width, height]);

  function getCanvasEl() {
    if (!canvasEl.current) throw Error("can't get canvas element");
    return canvasEl.current;
  }

  function getContext() {
    const context = getCanvasEl().getContext("2d");
    if (!context) throw Error("can't get canvas context");
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

  function handleTouchStart(e: TouchEvent<HTMLCanvasElement>) {
    if (!finger && isFinger(e)) return;
    isDrawing.current = true;
    updateClientSize();

    drawer.current = new Drawer(getContext());

    const touch = e.touches[0] as iOSTouch;
    const pressure = (touch.force ?? 0) * lineWidth;
    const [x, y] = getPosition(touch);
    const lw = even ? lineWidth : drawer.current.computeLineWidth(pressure);

    const newP = { x, y, lineWidth: lw };

    drawer.current.drawBegin(newP);
  }

  function handleMouseStart(e: MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    updateClientSize();
    const [x, y] = getPosition(e);

    drawer.current = new Drawer(getContext());
    const newP = { x, y, lineWidth };
    drawer.current.drawBegin(newP);
  }

  function handleTouchMove(e: TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !drawer.current) return;

    const touch = e.touches[0] as iOSTouch;
    if (!finger && isFinger(e)) return;
    const pressure = (touch.force ?? 0) * lineWidth;
    const [x, y] = getPosition(touch);

    const lw = even ? lineWidth : drawer.current.computeLineWidth(pressure);

    const newP = { x, y, lineWidth: lw };
    drawer.current.drawCurve(newP, erasing ? "#ccc" : undefined);
    if (!erasing) return;
    eraser?.checkWithIntrpl([x, y]).forEach((uid) => {
      erased.current.add(uid);
    });
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !drawer.current) return;

    const [x, y] = getPosition(e);
    const newP = { x, y, lineWidth };
    drawer.current.drawCurve(newP, erasing ? "#ccc" : undefined);
    if (!erasing) return;
    eraser?.checkWithIntrpl([x, y]).forEach((uid) => {
      erased.current.add(uid);
    });
  }

  function handleEnd() {
    const d = drawer.current;
    if (!isDrawing.current || !d) return;
    isDrawing.current = false;

    const updateDrawState = erasing
      ? () => {
          setDrawState((prev) =>
            DrawState.eraseStrokes(prev, Array.from(erased.current))
          );
          erased.current.clear();
        }
      : () => {
          const points = d.points;
          if (points.length < 3) return;
          setDrawState((prev) => DrawState.addStroke(prev, points));
        };

    requestAnimationFrame(() => {
      requestAnimationFrame(updateDrawState);
    })
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
