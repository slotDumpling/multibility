import React, { useEffect, useRef } from "react";
import { drawPoints } from "../../lib/draw/drawer";
import { DrawState } from "../../lib/draw/DrawState";

export default React.memo(({ drawState }: { drawState: DrawState }) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D>();
  const { width, height } = drawState;

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
  }, []);

  useEffect(() => {
    console.log("display rerender");
    context.current?.clearRect(0, 0, width, height);

    drawState.getValidStrokes().forEach((stroke) => {
      if (!context.current) return;
      drawPoints(context.current, stroke.points, "black", width, height);
    });
  });

  return <canvas width={width} height={height} ref={canvasEl} />;
});
