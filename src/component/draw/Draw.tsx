import React, { TouchEvent, useEffect, useRef, useState } from "react";
import { DrawState, SetDrawState } from "../../lib/draw/DrawState";
import { isStylus } from "../../lib/touch/touch";
import { Set } from "immutable";
import paper from "paper";
import './draw.css'

export interface DrawCtrl {
  erasing: boolean;
  finger: boolean;
  even: boolean;
  lineWidth: number;
  color: string;
}

export default function Draw({
  drawState,
  onChange = () => {},
  erasing = false,
  finger = false,
  lineWidth = 10,
  color = "#000000",
}: {
  drawState: DrawState;
  onChange?: SetDrawState;
  erasing?: boolean;
  finger?: boolean;
  lineWidth?: number;
  color?: string;
}) {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Group>();
  const ratio = useRef(1);
  const path = useRef<paper.Path>();
  const [erased, setErased] = useState(Set<string>());
  if (erasing) {
    lineWidth = 10;
    color = "#eee";
  }

  const isEventValid = (e: TouchEvent<HTMLCanvasElement>) => {
    return finger || isStylus(e);
  };

  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (!clientWidth) return;
    ratio.current = width / clientWidth;
  };

  const setupPaper = () => {
    if (!canvasEl.current) return;
    scope.current.setup(canvasEl.current);
    scope.current.view.viewSize.width = width;
    scope.current.view.viewSize.height = height;
  };

  const handleDown = () => {
    scope.current.activate();
    path.current = new scope.current.Path();
    path.current.strokeColor = new paper.Color(color);
    path.current.strokeWidth = lineWidth;
    path.current.strokeCap = "round";
    updateRatio();
  };

  const handleDrag = (e: paper.MouseEvent) => {
    if (!path.current) return;
    path.current.add(e.point.multiply(ratio.current));
    path.current.smooth();

    if (!erasing) return;
    group.current?.children.forEach((p) => {
      if (!(p instanceof paper.Path)) return;
      if (path.current?.intersects(p)) {
        setErased((prev) => prev.add(p.name));
      }
    });
  };

  const handleUp = erasing
    ? () => {
        if (!path.current) return;
        onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
        setErased(Set());
      }
    : () => {
        if (!path.current) return;
        path.current.simplify();
        const { pathData } = path.current;
        onChange((prev) =>
          DrawState.addStroke(prev, pathData, lineWidth, color)
        );
      };

  const handlePaper = () => {
    scope.current.view.onMouseDown = handleDown;
    scope.current.view.onMouseDrag = handleDrag;
    scope.current.view.onMouseUp = handleUp;
  };

  const preventTouch = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!isEventValid(e)) e.stopPropagation();
  };

  useEffect(() => {
    setupPaper();
  }, []);

  useEffect(() => {
    path.current?.remove()
  }, [drawState]);

  useEffect(() => {
    handlePaper();
  });

  useEffect(() => {
    scope.current.activate();
    group.current = new scope.current.Group();

    drawState.getValidStrokes().forEach((stroke) => {
      let { pathData, lineWidth, color, uid } = stroke;
      if (erased.has(uid)) color += "55";
      const path = new paper.Path(pathData);
      path.strokeWidth = lineWidth;
      path.strokeCap = "round";
      path.strokeColor = new paper.Color(color);
      path.name = uid;
      group.current?.addChild(path);
    });

    return () => void group.current?.removeChildren();
  }, [drawState, erased]);

  return (
    <canvas
      data-paper-hidpi={false}
      className="draw-canvas"
      ref={canvasEl}
      onTouchStartCapture={preventTouch}
      onTouchMoveCapture={preventTouch}
    />
  );
}
