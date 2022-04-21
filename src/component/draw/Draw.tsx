import React, {
  Dispatch,
  SetStateAction,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import paper from "paper";
import { DrawState, SetDrawState, Stroke } from "../../lib/draw/DrawState";
import { releaseCanvas } from "../../lib/draw/drawer";
import { CtrlMode, defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { isStylus } from "../../lib/touch/touch";
import { Set } from "immutable";
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
  onChange?: SetDrawState;
  otherStates?: DrawState[];
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
  const ratio = useRef(1);
  const path = useRef<paper.Path>();
  const [rect, setRect] = useState<paper.Shape.Rectangle>();
  const selectGroup = useRef<paper.Group>();
  const [erased, setErased] = useState(Set<string>());

  let { color, finger, lineWidth, highlight, eraserWidth } = drawCtrl;

  const isEventValid = (e: TouchEvent<HTMLCanvasElement>) => {
    return finger || isStylus(e) || mode === "selected";
    // selected rectangle can always be dragged by finger.
  };

  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (clientWidth) ratio.current = width / clientWidth;
  };

  const setupPaper = () => {
    if (!canvasEl.current) return;
    scope.current.setup(canvasEl.current);

    const r = preview ? PREVIEW_WIDTH / width : 1;
    scope.current.view.viewSize.width = width * r;
    scope.current.view.viewSize.height = height * r;
    scope.current.view.scale(r, new paper.Point(0, 0));
  };

  const setNewRect = (e: paper.MouseEvent) => {
    updateRatio();
    scope.current.activate();
    const point = e.point.multiply(ratio.current);
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
      const point = e.point.multiply(ratio.current);
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
      const point = e.point.multiply(ratio.current);
      path.current.add(point);
      path.current.smooth();
    },
    erase(e: paper.MouseEvent) {
      const eraserPath = path.current;
      if (!eraserPath) return;
      scope.current.activate();
      const point = e.point.multiply(ratio.current);
      eraserPath.add(point);
      eraserPath.smooth();

      const newErased = group.current
        ?.filter((p) => !erased.has(p.name))
        .filter((p) => checkErase(p, eraserPath, e, ratio.current, eraserWidth))
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
      if (!rect?.size.width || !rect.size.height) return;
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
    if (!isEventValid(e)) e.stopPropagation();
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
    const strokes: Stroke[] = list.map((p) => ({
      uid: p.name,
      pathData: p.exportJSON(),
    }));
    onChange((prev) => DrawState.mutateStroke(prev, strokes));
  };

  const deleteSelected = () => {
    const list = selectGroup.current?.children;
    if (!list?.length) return;
    const deleted = list.map(item => item.name);
    onChange((prev) => DrawState.eraseStrokes(prev, deleted));
  }

  useEffect(() => {
    if (mode === "select") {
      //
    } else if (mode === "selected") {
      if (rect?.strokeColor) rect.strokeColor.alpha /= 2;
      scope.current.activate();
      const circle = new paper.Shape.Circle(new paper.Point(10, 10), 10);
      circle.strokeColor = new paper.Color('black');
      return updateMutation;
    } else if (mode === "delete") {
      deleteSelected()
      setMode('select');
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
  const cache = new WeakMap<paper.MouseEvent, paper.Point[]>();
  return (e: paper.MouseEvent, ratio: number, eraserWidth: number) => {
    const cached = cache.get(e);
    if (cached) return cached;

    const point = e.point.multiply(ratio);
    const delta = e.delta.multiply(ratio);
    const times = (delta.length / eraserWidth) * 2;
    const checkPoints: paper.Point[] = [];
    for (let i = 0; i < times; i += 1) {
      checkPoints.push(point.subtract(delta.multiply(i / times)));
    }
    cache.set(e, checkPoints);
    return checkPoints;
  };
})();

const checkErase = (
  checkedPath: paper.Path,
  eraserPath: paper.Path,
  e: paper.MouseEvent,
  ratio: number,
  eraserWidth: number
) => {
  const curveBound = eraserPath.lastSegment.curve?.strokeBounds;
  if (
    !(checkedPath instanceof paper.Path) ||
    !curveBound?.intersects(checkedPath.strokeBounds)
  ) {
    return false;
  }

  if (eraserPath.intersects(checkedPath)) return true;

  const checkPoints = getCheckPoints(e, ratio, eraserWidth);
  return checkPoints.some((cPoint) => {
    const d = checkedPath.getNearestPoint(cPoint)?.getDistance(cPoint);
    return d && d < (checkedPath.strokeWidth + eraserWidth) / 2;
  });
};
