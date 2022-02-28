import React, {
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
} from "react";
import { iOSTouch, isFinger } from "../../lib/touch/touch";
import { Eraser } from "../../lib/draw/eraser";
import { DrawState, SetDrawState } from "../../lib/draw/DrawState";

export default function DrawErase({
  drawState,
  setDrawState,
  finger,
  eraser,
}: {
  drawState: DrawState;
  setDrawState: SetDrawState;
  finger: boolean;
  eraser: Eraser;
}) {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const clientWidth = useRef(width);
  const clientHeight = useRef(height);

  const isErasing = useRef(false);
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
    isErasing.current = true;
    updateClientSize();
  }

  function handleMouseStart(e: MouseEvent<HTMLCanvasElement>) {
    isErasing.current = true;
    updateClientSize();
  }

  function handleTouchMove(e: TouchEvent<HTMLCanvasElement>) {
    if (!isErasing.current) return;
    const touch = e.touches[0] as iOSTouch;
    if (!finger && isFinger(e)) return;
    const [x, y] = getPosition(touch);
    eraser?.checkWithIntrpl([x, y]).forEach(uid => {
      erased.current.add(uid);
    });
  }

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!isErasing.current) return;
    const [x, y] = getPosition(e);
    eraser?.checkWithIntrpl([x, y]).forEach(uid => {
      erased.current.add(uid);
    });
  }

  function handleEnd() {
    if (!isErasing.current) return;
    isErasing.current = false;
    setDrawState((prev) =>
      DrawState.eraseStrokes(prev, Array.from(erased.current))
    );
    erased.current.clear();
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
