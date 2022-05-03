import React, { useRef, useState, useEffect, TouchEvent, useMemo } from "react";
import { CtrlMode, defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { DrawState, Mutation, Stroke } from "../../lib/draw/DrawState";
import { releaseCanvas } from "../../lib/draw/drawer";
import { Setter, usePreventGesture } from "../../lib/hooks";
import { isStylus } from "../../lib/touch/touch";
import { usePinch } from "@use-gesture/react";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

const PREVIEW_WIDTH = 200;
const {
  Point,
  Path,
  Group,
  Shape: { Rectangle },
  Color,
  Size,
  Raster,
} = paper;

const Draw = ({
  drawState,
  onChange = () => {},
  otherStates,
  drawCtrl = defaultDrawCtrl,
  mode = "draw",
  setMode = () => {},
  readonly = false,
  preview = false,
  imgSrc,
}: {
  drawState: DrawState;
  otherStates?: DrawState[];
  onChange?: Setter<DrawState>;
  drawCtrl?: DrawCtrl;
  mode?: CtrlMode;
  setMode?: Setter<CtrlMode>;
  readonly?: boolean;
  preview?: boolean;
  imgSrc?: string;
}) => {
  const { width, height } = drawState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Path[]>();
  const path = useRef<paper.Path>();
  const [rect, setRect] = useState<paper.Shape.Rectangle>();
  const selectGroup = useRef<paper.Group>();
  const [erased, setErased] = useState(Set<string>());
  const ratio = useRef(1);

  let { color, finger, lineWidth, highlight, eraserWidth } = drawCtrl;

  const isEventValid = (e: TouchEvent) =>
    isStylus(e) || (finger && e.touches.length === 1);
  const preventTouch = (e: TouchEvent) =>
    isEventValid(e) || e.stopPropagation();

  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (clientWidth) ratio.current = width / clientWidth;
  };

  const transformPoint = (projP: paper.Point) => {
    const { center, zoom } = scope.current.view;
    const viewP = scope.current.view.projectToView(projP);
    const absoluteP = viewP.multiply(ratio.current);
    const offsetP = new Point(width, height)
      .divide(2)
      .subtract(center.multiply(zoom));
    return absoluteP.subtract(offsetP).divide(zoom);
  };

  const setupPaper = () => {
    if (!canvasEl.current) return;
    scope.current.setup(canvasEl.current);

    const r = preview ? PREVIEW_WIDTH / width : 1;
    scope.current.view.viewSize = new Size(width, height).multiply(r);
    scope.current.view.scale(r, new Point(0, 0));
    paintBackground(width, height);
  };

  const setNewRect = (e: paper.MouseEvent) => {
    updateRatio();
    scope.current.activate();
    const point = transformPoint(e.point);
    const rectangle = startSelectRect(point);
    setRect(rectangle);
  };

  const handleDown = {
    draw() {
      updateRatio();
      scope.current.activate();
      path.current = startStroke(color, lineWidth, highlight);
    },
    erase() {
      updateRatio();
      scope.current.activate();
      path.current = startStroke("#0003", eraserWidth);
    },
    select(e: paper.MouseEvent) {
      setNewRect(e);
    },
    selected(e: paper.MouseEvent) {
      scope.current.activate();
      const point = transformPoint(e.point);
      if (!rect) return;
      if (!point.isInside(rect.strokeBounds)) {
        setNewRect(e);
        setMode("select");
      }
    },
    delete() {},
  }[mode];

  const handleDrag = {
    draw(e: paper.MouseEvent) {
      if (!path.current) return;
      scope.current.activate();
      const point = transformPoint(e.point);
      path.current.add(point);
      path.current.smooth();
    },
    erase(e: paper.MouseEvent) {
      const eraserPath = path.current;
      if (!eraserPath) return;
      scope.current.activate();
      const point = transformPoint(e.point);
      eraserPath.add(point);
      eraserPath.smooth();

      const newErased = group.current
        ?.filter((p) => !erased.has(p.name))
        .filter((p) => checkErase(p, eraserPath))
        .map((p) => p.name);
      newErased && setErased((prev) => prev.concat(newErased));
    },
    select(e: paper.MouseEvent) {
      if (!rect) return;
      scope.current.activate();
      const delta = e.delta.multiply(ratio.current);
      rect.size = rect.size.add(new Size(delta.x, delta.y));
      rect.position = rect.position.add(delta.divide(2));
    },
    selected(e: paper.MouseEvent) {
      const sGroup = selectGroup.current;
      if (!rect || !sGroup) return;
      const delta = e.delta.multiply(ratio.current);
      rect.position = rect.position.add(delta);
      sGroup.position = sGroup.position.add(delta);
    },
    delete() {},
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
      if (!rect || rect.size.width < 10 || rect.size.height < 10) {
        return setRect(undefined);
      }
      scope.current.activate();

      const bounds = rect.strokeBounds;
      selectGroup.current = new Group();
      group.current?.forEach((p) => {
        if (!(p instanceof paper.Path)) return;
        if (p.isInside(bounds) || p.intersects(rect)) {
          selectGroup.current?.addChild(p);
        }
      });
      selectGroup.current.shadowColor = new Color("#0005");
      selectGroup.current.shadowBlur = 10;
      setMode("selected");
    },
    selected() {},
    delete() {},
  }[mode];

  useEffect(() => {
    setupPaper();
    scope.current.activate();
    const cvs = canvasEl.current;
    return () => void (cvs && releaseCanvas(cvs));
  }, []);

  const handlePaper = () => {
    if (readonly) return;
    scope.current.view.onMouseDown = handleDown;
    scope.current.view.onMouseDrag = handleDrag;
    scope.current.view.onMouseUp = handleUp;
  };
  useEffect(handlePaper);

  useEffect(() => {
    if (!imgSrc) return;
    const img = new Image();
    img.src = imgSrc;
    let raster: paper.Raster;

    img.onload = () => {
      scope.current.activate();
      raster = new Raster(img);
      raster.position = scope.current.view.center;
      let r = width / img.width;
      raster.scale(r);
      raster.sendToBack();
      raster.parent.getItem({ name: "BGRECT" })?.sendToBack();
    };

    return () => void raster?.remove();
  }, [imgSrc]);

  const mergedStrokes = useMemo(() => {
    if (!otherStates) return drawState.getStrokeList();
    else return DrawState.mergeStates([drawState, ...otherStates]);
  }, [drawState, otherStates]);

  useEffect(() => {
    scope.current.activate();
    group.current = [];
    const otherGroup: paper.Path[] = [];

    mergedStrokes.forEach((stroke) => {
      const passedGroup = drawState.hasStroke(stroke.uid)
        ? group.current
        : otherGroup;
      paintStroke(stroke, passedGroup, erased);
    });

    return () => {
      group.current?.forEach((item) => item.remove());
      otherGroup.forEach((item) => item.remove());
    };
  }, [mergedStrokes, erased]);

  const updateMutation = () => {
    const sg = selectGroup.current;
    if (!sg) return;
    sg.shadowColor = null;
    const list = sg.children;
    if (!list.length) return;

    const mutations: Mutation[] = list.map((p) => [p.name, p.exportJSON()]);
    onChange((prev) => DrawState.mutateStroke(prev, mutations));
  };

  const deleteSelected = () => {
    const list = selectGroup.current?.children;
    if (!list?.length) return;
    const deleted = list.map((item) => item.name);
    onChange((prev) => DrawState.eraseStrokes(prev, deleted));
  };

  useEffect(() => {
    if (mode === "select") {
      //
    } else if (mode === "selected") {
      if (rect?.strokeColor) rect.strokeColor.alpha /= 2;
      scope.current.activate();
      return updateMutation;
    } else if (mode === "delete") {
      deleteSelected();
      setMode("select");
      setRect(undefined);
    } else {
      setRect(undefined);
    }
  }, [mode]);

  useEffect(() => {
    if (!rect) return;
    let id = 0;
    const moveDash = () => {
      rect.dashOffset += 3;
      id = requestAnimationFrame(moveDash);
    };
    moveDash();
    return () => {
      rect.remove();
      cancelAnimationFrame(id);
    };
  }, [rect]);

  usePinch(
    ({ memo, offset, last, first, origin }) => {
      if (!canvasEl.current) return;

      let lastScale, lastOX, lastOY, osX, osY: number;
      if (first || !memo) {
        updateRatio();
        scope.current.activate();
        const { x, y } = canvasEl.current.getBoundingClientRect();
        [lastScale, [lastOX, lastOY], [osX, osY]] = [
          1,
          [origin[0] - x, origin[1] - y],
          [x, y],
        ];
      } else {
        [lastScale, [lastOX, lastOY], [osX, osY]] = memo;
      }

      const { view } = scope.current;

      const scale = first ? 1 : offset[0] / lastScale;
      const r = ratio.current;
      const [oX, oY] = [origin[0] - osX, origin[1] - osY];
      const originViewP = new Point(oX, oY).multiply(r);
      const originProjP = view.viewToProject(originViewP);
      view.scale(scale, originProjP);

      const [dX, dY] = [oX - lastOX, oY - lastOY];
      const transP = new Point(dX, dY).multiply(r / offset[0]);
      view.translate(transP);

      if (!last) return [offset[0], [oX, oY], [osX, osY]];
      putCenterBack(view);
    },
    {
      scaleBounds: { max: 5, min: 0.3 },
      target: canvasEl,
    }
  );

  usePreventGesture();
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

const paintStroke = (
  stroke: Stroke,
  group?: paper.Path[],
  erased?: Set<string>
) => {
  let { pathData, uid } = stroke;
  try {
    const path = new Path();
    path.importJSON(pathData);
    path.name = uid;
    if (erased?.has(uid)) path.opacity /= 2;
    group?.push(path);
  } catch (e) {
    console.error(e);
  }
};

const getCheckPoints = (() => {
  const cache = new WeakMap<paper.Segment, paper.Point[]>();
  return (segment: paper.Segment, width: number) => {
    const cached = cache.get(segment);
    if (cached) return cached;

    const { point } = segment;
    const prevPoint = segment.previous?.point;
    if (!prevPoint) return [];
    const delta = point.subtract(prevPoint);
    const times = (delta.length / width) * 2;
    const checkPoints: paper.Point[] = [];
    for (let i = 0; i < times; i += 1) {
      checkPoints.push(point.subtract(delta.multiply(i / times)));
    }
    cache.set(segment, checkPoints);
    return checkPoints;
  };
})();

const checkErase = (checkedPath: paper.Path, eraserPath: paper.Path) => {
  const curveBound = eraserPath.lastSegment.curve?.strokeBounds;
  if (
    !(checkedPath instanceof paper.Path) ||
    !curveBound?.intersects(checkedPath.strokeBounds)
  ) {
    return false;
  }

  if (eraserPath.intersects(checkedPath)) return true;

  const { strokeWidth, lastSegment } = eraserPath;
  const checkPoints = getCheckPoints(lastSegment, strokeWidth);
  return checkPoints.some((cPoint) => {
    const d = checkedPath.getNearestPoint(cPoint)?.getDistance(cPoint);
    return d && d < (checkedPath.strokeWidth + strokeWidth) / 2;
  });
};

const paintBackground = (width: number, height: number) => {
  const bgRect = new Rectangle(new Point(0, 0), new Point(width, height));
  bgRect.fillColor = new Color("#fff");
  bgRect.name = "BGRECT";
  bgRect.sendToBack();
  bgRect.strokeColor = new Color("#ddd");
  bgRect.strokeWidth = 1;
  return bgRect;
};

const startSelectRect = (point: paper.Point) => {
  const rect = new Rectangle(point, new Size(0, 0));
  rect.strokeColor = new Color("#1890ff");
  rect.strokeWidth = 3;
  rect.dashOffset = 0;
  rect.dashArray = [30, 20];
  return rect;
};

const startStroke = (color: string, lineWidth: number, highlight = false) => {
  const path = new Path();
  const strokeColor = new Color(color);
  if (highlight) {
    strokeColor.alpha /= 2;
    path.blendMode = "multiply";
  }
  path.strokeColor = strokeColor;
  path.strokeWidth = lineWidth;
  path.strokeJoin = "round";
  path.strokeCap = "round";
  return path;
};

const getCenterTranslate = (view: paper.View) => {
  const { center, zoom } = view;
  const { height, width } = view.viewSize;
  const { x, y } = center;
  if (zoom <= 1) return [width / 2 - x, height / 2 - y];

  const dX = (width * (zoom - 1)) / zoom / 2;
  const dY = (height * (zoom - 1)) / zoom / 2;
  const [minX, maxX, minY, maxY] = [
    width / 2 - dX,
    width / 2 + dX,
    height / 2 - dY,
    height / 2 + dY,
  ];

  const deltaX = x < minX ? minX - x : x > maxX ? maxX - x : 0;
  const deltaY = y < minY ? minY - y : y > maxY ? maxY - y : 0;
  return [deltaX, deltaY];
};

const putCenterBack = (view: paper.View) => {
  const [deltaX, deltaY] = getCenterTranslate(view);
  let count = 10;
  const dP = new Point(deltaX, deltaY).divide(count);
  const move = () => {
    view.center = view.center.add(dP);
    if (--count > 0) requestAnimationFrame(move);
  };
  move();
};
