import React, {
  useRef,
  Dispatch,
  useState,
  useEffect,
  TouchEvent,
  SetStateAction,
} from "react";
import { CtrlMode, defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { DrawState, SetDrawState, Stroke } from "../../lib/draw/DrawState";
import { releaseCanvas } from "../../lib/draw/drawer";
import { isStylus } from "../../lib/touch/touch";
import { usePinch } from "@use-gesture/react";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

const PREVIEW_WIDTH = 200;

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
  onChange?: SetDrawState;
  drawCtrl?: DrawCtrl;
  mode?: CtrlMode;
  setMode?: Dispatch<SetStateAction<CtrlMode>>;
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

  const isEventValid = (e: TouchEvent<HTMLCanvasElement>) => {
    return finger || isStylus(e);
  };

  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (clientWidth) ratio.current = width / clientWidth;
  };

  const transformPoint = (point: paper.Point) => {
    const { center, zoom } = scope.current.view;
    const offsetP = new paper.Point(width, height)
      .divide(2)
      .subtract(center.multiply(zoom));
    const projP = scope.current.view.projectToView(point);
    const absoluteP = projP.multiply(ratio.current);
    return absoluteP.subtract(offsetP).divide(zoom);
  };

  const setupPaper = () => {
    if (!canvasEl.current) return;
    scope.current.setup(canvasEl.current);

    const r = preview ? PREVIEW_WIDTH / width : 1;
    scope.current.view.viewSize.width = width * r;
    scope.current.view.viewSize.height = height * r;
    scope.current.view.scale(r, new paper.Point(0, 0));
    const bgRect = new paper.Shape.Rectangle(
      new paper.Point(0, 0),
      new paper.Point(width, height)
    );
    bgRect.fillColor = new paper.Color("#fff");
    bgRect.name = "BACKGROUND";
    bgRect.sendToBack();
  };

  const setNewRect = (e: paper.MouseEvent) => {
    updateRatio();
    scope.current.activate();
    const point = transformPoint(e.point);
    const rectangle = new paper.Shape.Rectangle(point, new paper.Size(0, 0));
    rectangle.strokeColor = new paper.Color("#1890ff");
    rectangle.strokeWidth = 3;
    rectangle.dashOffset = 0;
    rectangle.dashArray = [30, 20];
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
      selectGroup.current = new paper.Group();
      group.current?.forEach((p) => {
        if (!(p instanceof paper.Path)) return;
        if (p.isInside(bounds) || p.intersects(rect)) {
          selectGroup.current?.addChild(p);
        }
      });
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

  const preventTouch = (e: TouchEvent<HTMLCanvasElement>) => {
    isEventValid(e) || e.stopPropagation();
  };

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
      raster.parent.getItem({ name: "BACKGROUND" })?.sendToBack();
    };

    return () => void raster?.remove();
  }, [imgSrc]);

  useEffect(() => {
    scope.current.activate();
    group.current = [];

    drawState.getValidStrokes().forEach((stroke) => {
      paintStroke(stroke, group.current, erased);
    });

    return () => group.current?.forEach((item) => item.remove());
  }, [drawState, erased]);

  useEffect(() => {
    scope.current.activate();
    const otherGroup: paper.Path[] = [];

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
    const mutations: [string, string][] = list.map((p) => [
      p.name,
      p.exportJSON(),
    ]);
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
      id = requestAnimationFrame(() => {
        rect.dashOffset += 3;
        moveDash();
      });
    };
    moveDash();
    return () => {
      rect.remove();
      cancelAnimationFrame(id);
    };
  }, [rect]);

  const bind = usePinch(
    (state) => {
      const { memo, offset, last, first, origin } = state;

      first && updateRatio();

      const [lastScale, lastOX, lastOY] = memo ?? [1, origin[0], origin[1]];
      const scale = first ? 1 : offset[0] / lastScale;
      const r = ratio.current;
      const [oX, oY] = origin;
      const originP = new paper.Point(oX, oY).multiply(r);
      scope.current.view.scale(scale, originP);
      
      const [dX, dY] = [oX - lastOX, oY - lastOY];
      const transP = new paper.Point(dX, dY).multiply(r / offset[0]);
      scope.current.view.translate(transP);
      
      if (offset[0] === 1) {
        scope.current.view.center = new paper.Point(width, height).divide(2);
      }
      
      if (!last) return [offset[0], origin[0], origin[1]];
    },
    {
      scaleBounds: { max: 3, min: 1 },
    }
  );

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  return (
    <canvas
      ref={canvasEl}
      className="draw-canvas"
      data-paper-hidpi={false}
      onTouchStartCapture={preventTouch}
      onTouchMoveCapture={preventTouch}
      {...bind()}
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
    const path = new paper.Path();
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
