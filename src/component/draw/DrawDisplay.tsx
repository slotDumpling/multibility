import React, { useEffect, useRef } from "react";
import "./draw.css";
import { drawPoints } from "./lib/drawer";
import { DrawState } from "./lib/DrawState";

export default function Drawdisplay({
  drawState,
  width,
  height,
}: {
  drawState: DrawState;
  width: number;
  height: number;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D>();

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
    context.current?.clearRect(0, 0, width, height);

    drawState.getValidStrokes().forEach((stroke) => {
      if (!context.current) return;
      drawPoints(context.current, stroke.points);
    });
    console.timeEnd('stroke');
  });

  return <canvas width={width} height={height} ref={canvasEl} />;
}
