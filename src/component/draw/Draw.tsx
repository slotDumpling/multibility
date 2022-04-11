import React, { CSSProperties, TouchEvent, useEffect, useRef, useState } from "react";
import { DrawState, SetDrawState, Stroke } from "../../lib/draw/DrawState";
import { isStylus } from "../../lib/touch/touch";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";
import { releaseCanvas } from "../../lib/draw/drawer";

const PREVIEW_WIDTH = 200;

const Draw = ({
  drawState,
  onChange = () => {},
  otherStates,
  erasing = false,
  finger = false,
  lineWidth = 10,
  color = "#000000",
  highlight = false,
  readonly = false,
  preview = false,
  imgSrc,
}: {
  drawState: DrawState;
  onChange?: SetDrawState;
  otherStates?: DrawState[];
  erasing?: boolean;
  finger?: boolean;
  lineWidth?: number;
  color?: string;
  highlight?: boolean;
  readonly?: boolean;
  preview?: boolean;
  imgSrc?: string;
}) => {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Group>();
  const ratio = useRef(1);
  const path = useRef<paper.Path>();
  const [erased, setErased] = useState(Set<string>());

  if (erasing) {
    // lineWidth = 10;
    color = "#aaa8";
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

    const r = PREVIEW_WIDTH / width;
    scope.current.view.viewSize.width = preview ? width * r : width;
    scope.current.view.viewSize.height = preview ? height * r : height;

    if (preview) {
      scope.current.view.scale(r, new paper.Point(0, 0));
    }
  };

  const handleDown = () => {
    scope.current.activate();
    path.current = new scope.current.Path();
    const strokeColor = new paper.Color(color);
    if (highlight) {
      strokeColor.alpha /= 2;
      path.current.blendMode = "multiply";
    }
    path.current.strokeColor = strokeColor;
    path.current.strokeWidth = lineWidth;
    path.current.strokeJoin = "round";
    path.current.strokeCap = "round";
    updateRatio();
  };

  const handleDrag = (e: paper.MouseEvent) => {
    if (!path.current) return;
    path.current.add(e.point.multiply(ratio.current));
    path.current.smooth();

    if (!erasing) return;
    group.current?.children.forEach((p) => {
      if (!path.current) return;
      if (!(p instanceof paper.Path)) return;
      if (path.current.intersects(p)) {
        setErased((prev) => prev.add(p.name));
      }
    });
  };

  const handleUp = erasing
    ? () => {
        if (!path.current) return;
        path.current.remove();
        onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
        setErased(Set());
      }
    : () => {
        if (!path.current || path.current.segments.length === 0) return;
        path.current.simplify();
        if (path.current.segments.length === 0) return;
        const pathData = path.current.exportJSON();
        path.current.remove();
        onChange((prev) => DrawState.addStroke(prev, { pathData }));
      };

  const handlePaper = () => {
    if (readonly) return;
    scope.current.view.onMouseDown = handleDown;
    scope.current.view.onMouseDrag = handleDrag;
    scope.current.view.onMouseUp = handleUp;
  };

  const preventTouch = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!isEventValid(e)) e.stopPropagation();
  };

  useEffect(() => {
    setupPaper();
    scope.current.activate();
    const cvs = canvasEl.current;
    return () => void (cvs && releaseCanvas(cvs));
  }, []);

  useEffect(() => {
    if (!imgSrc) return;
    const img = new Image();
    img.src = imgSrc;
    let raster: paper.Raster;

    img.onload = () => {
      scope.current.activate();
      raster = new paper.Raster(img);
      raster.position = scope.current.view.center;
      let r = width / img.width;
      raster.scale(r);
      raster.sendToBack();
    };

    return () => void raster?.remove();
  }, [imgSrc]);

  useEffect(handlePaper);

  const paintStroke = (stroke: Stroke, group?: paper.Group) => {
    let { pathData, uid } = stroke;
    scope.current.activate();
    try {
      const path = new paper.Path();
      path.importJSON(pathData);
      path.name = uid;
      if (erased.has(uid)) path.opacity /= 2;
      group?.addChild(path);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    scope.current.activate();
    group.current = new scope.current.Group();

    drawState.getValidStrokes().forEach((stroke) => {
      paintStroke(stroke, group.current);
    });

    return () => void group.current?.removeChildren();
  }, [drawState, erased]);

  useEffect(() => {
    scope.current.activate();
    const otherGroup = new scope.current.Group();

    otherStates?.forEach((ds) => {
      ds.getValidStrokes().forEach((stroke) => {
        paintStroke(stroke, otherGroup);
      });
    });

    return () => void otherGroup.removeChildren();
  }, [otherStates]);

  return (
    <canvas
      ref={canvasEl}
      className="draw-canvas"
      data-paper-hidpi={false}
      onTouchStartCapture={preventTouch}
      onTouchMoveCapture={preventTouch}
    />
  );
};

export default React.memo(Draw);
