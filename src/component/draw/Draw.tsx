import React, { TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import paper from "paper";
import { DrawState, SetDrawState, Stroke } from "../../lib/draw/DrawState";
import { isStylus } from "../../lib/touch/touch";
import { Set } from "immutable";
import { releaseCanvas } from "../../lib/draw/drawer";
import { DrawCtrl } from "../../lib/draw/drawCtrl";
import "./draw.sass";

const PREVIEW_WIDTH = 200;

const Draw = ({
  drawState,
  onChange = () => {},
  otherStates,
  drawCtrl,
  readonly = false,
  preview = false,
  imgSrc,
}: {
  drawState: DrawState;
  onChange?: SetDrawState;
  otherStates?: DrawState[];
  drawCtrl: DrawCtrl;
  readonly?: boolean;
  preview?: boolean;
  imgSrc?: string;
}) => {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Item[]>();
  const ratio = useRef(1);
  const path = useRef<paper.Path>();
  const [rect, setRect] = useState<paper.Shape.Rectangle>();
  const selectGroup = useRef<paper.Group>();
  const [erased, setErased] = useState(Set<string>());

  let {
    mode: ctrlMode,
    color,
    finger,
    lineWidth,
    highlight,
    eraserWidth,
  } = drawCtrl;

  const [selected, setSelected] = useState(false);
  const mode = useMemo(() => {
    if (ctrlMode !== "select") return ctrlMode;
    return selected ? "selected" : "select";
  }, [ctrlMode, selected]);
  useEffect(() => setSelected(false), [ctrlMode]);

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

  const setNewRect = (e: paper.MouseEvent) => {
    updateRatio();
    scope.current.activate();
    const point = e.point.multiply(ratio.current);
    const rectangle = new paper.Shape.Rectangle(point, new paper.Size(0, 0));
    rectangle.strokeColor = new paper.Color("#1890ff");
    rectangle.strokeWidth = 5;
    rectangle.dashOffset = 0;
    rectangle.dashArray = [50, 30];
    setRect(rectangle);
  };

  const handleDown = {
    draw() {
      updateRatio();
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
    },
    erase() {
      updateRatio();
      scope.current.activate();
      path.current = new scope.current.Path();
      const strokeColor = new paper.Color("#0003");
      path.current.strokeColor = strokeColor;
      path.current.strokeWidth = eraserWidth;
      path.current.strokeJoin = "round";
      path.current.strokeCap = "round";
    },
    select(e: paper.MouseEvent) {
      setNewRect(e);
    },
    selected(e: paper.MouseEvent) {
      scope.current.activate();
      const point = e.point.multiply(ratio.current);
      if (!rect) return;
      if (!point.isInside(rect.strokeBounds)) {
        setNewRect(e);
        setSelected(false);
      }
    },
  }[mode];

  const handleDrag = {
    draw(e: paper.MouseEvent) {
      if (!path.current) return;
      scope.current.activate();
      const point = e.point.multiply(ratio.current);
      path.current.add(point);
      path.current.smooth();
    },
    erase(e: paper.MouseEvent) {
      if (!path.current) return;
      scope.current.activate();
      const point = e.point.multiply(ratio.current);
      path.current.add(point);
      path.current.smooth();

      const checkPoints = getCheckPoints(e, ratio.current, eraserWidth);
      const curveBound = path.current.lastSegment.curve?.strokeBounds;
      const newErased = group.current
        ?.filter((p) => {
          if (
            erased.has(p.name) ||
            !(p instanceof paper.Path) ||
            !curveBound?.intersects(p.strokeBounds)
          ) {
            return false;
          }

          if (path.current?.intersects(p)) return true;

          return checkPoints.some((cPoint) => {
            const d = p.getNearestPoint(cPoint)?.getDistance(cPoint);
            return d && d < (p.strokeWidth + eraserWidth) / 2;
          });
        })
        .map((p) => p.name);
      newErased && setErased((prev) => prev.concat(newErased));
    },
    select(e: paper.MouseEvent) {
      if (!rect) return;
      scope.current.activate();
      const delta = e.delta.multiply(ratio.current);
      rect.size = rect.size.add(new paper.Size(delta.x, delta.y));
      rect.position = rect.position.add(delta.divide(2));
    },
    selected(e: paper.MouseEvent) {
      const sGroup = selectGroup.current;
      if (!rect || !sGroup) return;
      const delta = e.delta.multiply(ratio.current);
      rect.position = rect.position.add(delta);
      sGroup.position = sGroup.position.add(delta);
    },
  }[mode];

  const handleUp = {
    erase() {
      if (!path.current) return;
      scope.current.activate();
      path.current.remove();
      onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
      setErased(Set());
    },
    draw() {
      if (!path.current || path.current.segments.length === 0) return;
      path.current.simplify();
      if (path.current.segments.length === 0) return;
      const pathData = path.current.exportJSON();
      path.current.remove();
      onChange((prev) => DrawState.addStroke(prev, pathData));
    },
    select() {
      if (!rect) return;
      scope.current.activate();

      const bounds = rect.strokeBounds;
      selectGroup.current = new paper.Group();
      group.current?.forEach((p) => {
        if (!(p instanceof paper.Path)) return;
        if (p.isInside(bounds) || p.intersects(rect)) {
          selectGroup.current?.addChild(p);
        }
      });
      setSelected(true);
    },
    selected() {},
  }[mode];

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

  const paintStroke = (stroke: Stroke, group?: paper.Item[]) => {
    let { pathData, uid } = stroke;
    scope.current.activate();
    try {
      const path = new paper.Path();
      path.importJSON(pathData);
      path.name = uid;
      if (erased.has(uid)) path.opacity /= 2;
      group?.push(path);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    scope.current.activate();
    group.current = [];

    drawState.getValidStrokes().forEach((stroke) => {
      paintStroke(stroke, group.current);
    });

    return () => group.current?.forEach((item) => item.remove());
  }, [drawState, erased]);

  useEffect(() => {
    scope.current.activate();
    const otherGroup: paper.Item[] = [];

    otherStates?.forEach((ds) => {
      ds.getValidStrokes().forEach((stroke) => {
        paintStroke(stroke, otherGroup);
      });
    });

    return () => otherGroup.forEach((item) => item.remove());
  }, [otherStates]);

  const updateMutation = () => {
    const list = selectGroup.current?.children;
    if (!list?.length) return;
    const strokes: Stroke[] = list.map((p) => ({
      uid: p.name,
      pathData: p.exportJSON(),
    }));
    onChange((prev) => DrawState.mutateStroke(prev, strokes));
  };

  useEffect(() => {
    if (mode === "select") {
      //
    } else if (mode === "selected") {
      if (rect?.strokeColor) rect.strokeColor.alpha /= 2;
      return updateMutation;
    } else {
      setRect(undefined);
    }
  }, [mode]);

  useEffect(() => {
    if (!rect) return;
    let id = 0;
    const moveDash = () => {
      id = requestAnimationFrame(() => {
        rect.dashOffset -= 5;
        moveDash();
      });
    };
    moveDash();
    rect.onClick = () => console.log('clicked');
    return () => {
      rect.remove();
      cancelAnimationFrame(id);
    };
  }, [rect]);

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

const getCheckPoints = (
  e: paper.MouseEvent,
  ratio: number,
  lineWidth: number
) => {
  const point = e.point.multiply(ratio);

  const delta = e.delta.multiply(ratio);
  const times = (delta.length / lineWidth) * 2;
  const checkPoints: paper.Point[] = [];
  for (let i = 0; i < times; i += 1) {
    checkPoints.push(point.subtract(delta.multiply(i / times)));
  }
  return checkPoints;
};
