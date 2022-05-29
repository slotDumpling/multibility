import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  ComponentType,
} from "react";
import { usePreventTouch, usePreventGesture } from "../../lib/touch/touch";
import { DrawState, Mutation, Stroke } from "../../lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { Setter } from "../../lib/hooks";
import { releaseCanvas } from "../../lib/draw/canvas";
import { usePinch } from "@use-gesture/react";
import { v4 as getUid } from "uuid";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

export type SelectToolType = ComponentType<{
  onDelete: () => void;
  onRotate: (angle: number, smooth?: boolean) => void;
  onDuplicate: () => void;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
  rasterize: () => string;
  currDrawCtrl: DrawCtrl;
}>;

export type TextToolType = ComponentType<{
  onSubmit: (text: string, fontSize: number, color: string) => void;
  onCancel: () => void;
}>;

const PREVIEW_WIDTH = 200;
const {
  Path,
  Size,
  Point,
  Group,
  Color,
  Raster,
  Shape: { Rectangle },
} = paper;

const Draw: FC<{
  drawState: DrawState;
  otherStates?: DrawState[];
  onChange?: Setter<DrawState>;
  drawCtrl?: DrawCtrl;
  readonly?: boolean;
  preview?: boolean;
  imgSrc?: string;
  SelectTool?: SelectToolType;
  TextTool?: TextToolType;
}> = ({
  drawState,
  otherStates,
  onChange = () => {},
  drawCtrl = defaultDrawCtrl,
  preview = false,
  readonly = preview,
  imgSrc,
  SelectTool,
  TextTool,
}) => {
  const { width, height } = drawState;
  const { mode, color, finger, lineWidth, highlight, eraserWidth, lasso } =
    drawCtrl;

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Item[]>([]);
  const [erased, setErased] = useState(Set<string>());
  const [currDrawCtrl, setCurrDrawCtrl] = useState(defaultDrawCtrl);
  const [path, setPath] = usePaperItem<paper.Path>();
  const [rect, setRect] = usePaperItem<paper.Shape.Rectangle>();
  const [selectedGroup, setSelectedGroup] = usePaperItem<paper.Group>();

  const ratio = useRef(1);
  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (clientWidth) ratio.current = width / clientWidth;
    scope.current.activate();
  };

  const transformPoint = (projP: paper.Point) => {
    scope.current.activate();
    const { center, zoom } = scope.current.view;
    const viewP = scope.current.view.projectToView(projP);
    const absoluteP = viewP.multiply(ratio.current);
    const offsetP = new Point(width, height)
      .divide(2)
      .subtract(center.multiply(zoom));
    return absoluteP.subtract(offsetP).divide(zoom);
  };

  useEffect(() => {
    const setupPaper = () => {
      if (!canvasEl.current) return;
      scope.current.setup(canvasEl.current);

      const r = preview ? PREVIEW_WIDTH / width : 1;
      scope.current.view.viewSize = new Size(width, height).multiply(r);
      scope.current.view.scale(r, new Point(0, 0));
      paintBackground(scope.current, width, height);
    };

    setupPaper();
    const cvs = canvasEl.current;
    return () => void (cvs && releaseCanvas(cvs));
  }, [width, height, preview]);

  const setNewRect = (e: paper.MouseEvent) => {
    const point = transformPoint(e.point);
    const rectangle = startSelectRect(point);
    setRect(rectangle);
  };

  const [selected, setSelected] = useState(false);
  const paperMode = mode === "select" && selected ? "selected" : mode;
  const resetSelect = useCallback(() => {
    setSelected(false);
    setPath(undefined);
    setRect(undefined);
  }, [setPath, setRect]);

  useEffect(() => {
    if (mode !== "select") return;
    return resetSelect;
  }, [mode, resetSelect]);

  useEffect(() => {
    if (selected) return;
    updateMutation();
    setSelectedGroup(undefined);
    setCurrDrawCtrl(defaultDrawCtrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(resetSelect, [lasso, resetSelect]);

  const handleDown = {
    draw() {
      updateRatio();
      setPath(startStroke(color, lineWidth, highlight));
    },
    erase() {
      updateRatio();
      setPath(startStroke("#0003", eraserWidth));
    },
    select(e: paper.MouseEvent) {
      updateRatio();
      if (lasso) setPath(startStroke("#1890ff", 5));
      else setNewRect(e);
    },
    selected(e: paper.MouseEvent) {
      updateRatio();
      const point = transformPoint(e.point);
      // check if point is outside of selection;
      if (lasso) {
        if (path?.contains(point)) return;
        setPath(startStroke("#1890ff", 5));
      } else {
        if (rect?.contains(point)) return;
        setNewRect(e);
      }
      setSelected(false);
    },
    text(e: paper.MouseEvent) {
      updateRatio();
      const point = transformPoint(e.point);
      const t = new paper.PointText(point);
      setPointText(t);
    },
  }[paperMode];

  const handleDrag = {
    draw(e: paper.MouseEvent) {
      if (!path) return;
      scope.current.activate();
      const point = transformPoint(e.point);
      path.add(point);
      path.smooth();
    },
    erase(e: paper.MouseEvent) {
      if (!path) return;
      scope.current.activate();
      const point = transformPoint(e.point);
      path.add(point);
      path.smooth();

      const newErased = group.current
        .filter((p) => !erased.has(p.name))
        .filter((p) => p instanceof paper.Path && checkErase(p, path))
        .map((p) => p.name);
      setErased((prev) => prev.concat(newErased));
    },
    select(e: paper.MouseEvent) {
      scope.current.activate();
      if (lasso) {
        if (!path) return;
        const point = transformPoint(e.point);
        path.add(point);
        path.smooth();
      } else {
        if (!rect) return;
        const delta = e.delta.multiply(ratio.current);
        rect.size = rect.size.add(new Size(delta.x, delta.y));
        rect.translate(delta.divide(2));
      }
    },
    selected(e: paper.MouseEvent) {
      if (!selectedGroup) return;
      scope.current.activate();
      const delta = e.delta.multiply(ratio.current);
      selectedGroup.translate(delta);
      path?.translate(delta);
      rect?.translate(delta);
    },
    text: null,
  }[paperMode];

  const handleUp = {
    draw() {
      if (!path || path.segments.length === 0) return;
      scope.current.activate();
      path.simplify();
      const pathData = path.exportJSON();
      onChange((prev) => DrawState.addStroke(prev, pathData));
      setPath(undefined);
    },
    erase() {
      if (!path) return;
      scope.current.activate();
      onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
      setErased(Set());
      setPath(undefined);
    },
    select() {
      scope.current.activate();
      const items = group.current;
      let newSG: paper.Group;
      if (lasso) {
        if (!path || path.length < 50) return setPath(undefined);
        path.closePath();
        moveDash(path);
        newSG = new Group(checkPathSelection(path, items));
      } else {
        if (!rect) return;
        const { width, height } = rect.size.abs();
        if (width < 10 || height < 10) return setRect(undefined);
        moveDash(rect);
        newSG = new Group(checkRectSelection(rect, items));
      }
      setSelectedGroup(newSG);
      const tempStyle = parseGroupStyle(newSG);
      setCurrDrawCtrl((prev) => ({ ...prev, ...tempStyle }));
      setSelected(true);
    },
    selected: null,
    text: null,
  }[paperMode];

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
      scope.current.project.layers[0].addChild(raster);
      raster.position = scope.current.view.center;
      let r = width / img.width;
      raster.scale(r);
    };

    return () => void raster?.remove();
  }, [imgSrc, width]);

  const mergedStrokes = useMemo(
    () =>
      otherStates
        ? DrawState.mergeStates(drawState, ...otherStates)
        : drawState.getStrokeList(),
    [drawState, otherStates]
  );

  useEffect(() => {
    group.current = [];
    const othersGroup: paper.Item[] = [];

    mergedStrokes.forEach((stroke) =>
      paintStroke(
        stroke,
        scope.current,
        drawState.hasStroke(stroke.uid) ? group.current : othersGroup,
        erased.has(stroke.uid)
      )
    );

    return () => {
      group.current.forEach((item) => item.remove());
      othersGroup.forEach((item) => item.remove());
    };
  }, [mergedStrokes, erased, drawState]);

  const updateMutation = () => {
    const list = selectedGroup?.children;
    if (!list?.length) return;
    const mutations: Mutation[] = list.map((p) => [p.name, p.exportJSON()]);
    onChange((prev) => DrawState.mutateStrokes(prev, mutations));
  };

  const deleteSelected = () => {
    const list = selectedGroup?.children;
    if (!list?.length) return;

    const deleted = list.map((item) => item.name);
    onChange((prev) => DrawState.eraseStrokes(prev, deleted));
    setSelectedGroup(undefined);
    resetSelect();
  };

  const rotateSelected = (angle: number, smooth = false) => {
    if (!selectedGroup) return;
    let aniCount = smooth ? 10 : 1;
    const dAngle = angle / aniCount;
    const rotate = () => {
      selectedGroup.rotate(dAngle, (rect || path)?.position);
      rect?.rotate(dAngle, rect.position);
      path?.rotate(dAngle, path.position);
      if (--aniCount > 0) requestAnimationFrame(rotate);
    };
    rotate();
  };

  const mutateStyle = (updated: Partial<DrawCtrl>) => {
    if (!selectedGroup) return;
    scope.current.activate();
    updateGroupStyle(selectedGroup, updated, currDrawCtrl.highlight);
    setCurrDrawCtrl((prev) => ({ ...prev, ...updated }));
  };

  const duplicateSelected = () => {
    if (!selectedGroup) return;
    scope.current.activate();
    const newSG = selectedGroup.clone();
    updateMutation();
    setSelectedGroup(newSG);

    const size = (rect || path)?.bounds.size;
    if (!size) return;
    const { width, height } = size;
    const transP = new Point(width, height).divide(10);
    newSG.translate(transP);
    rect?.translate(transP);
    path?.translate(transP);
    newSG.children.forEach((p) => (p.name = getUid()));
  };

  const rasterize = () => {
    if (!selectedGroup) return "";
    const raster = selectedGroup.rasterize();
    const data = raster.toDataURL();
    raster.remove();
    return data;
  };

  const [pointText, setPointText] = usePaperItem<paper.PointText>();
  useEffect(() => {
    if (mode === "text") return () => setPointText(undefined);
  }, [mode, setPointText]);

  const submitText = (text: string, fontSize: number, color = "#000") => {
    if (!pointText) return;
    pointText.content = text;
    pointText.fontSize = fontSize;
    pointText.fillColor = new Color(color);
    const pathData = pointText.exportJSON();
    onChange((prev) => DrawState.addStroke(prev, pathData));
    setPointText(undefined);
  };
  const cancelText = () => setPointText(undefined);

  usePreventGesture();
  usePinch(
    ({ memo, offset: [scale], first, last, origin }) => {
      const { view } = scope.current;

      let lastScale, lastOX, lastOY, elX, elY: number;
      if (first || !memo) {
        updateRatio();
        if (!canvasEl.current) return;
        const { x, y } = canvasEl.current.getBoundingClientRect();
        lastScale = 1;
        [lastOX, lastOY] = [origin[0] - x, origin[1] - y];
        [elX, elY] = [x, y];
      } else {
        [lastScale, [lastOX, lastOY], [elX, elY]] = memo;
      }

      const r = ratio.current;
      const [oX, oY] = [origin[0] - elX, origin[1] - elY];
      const originViewP = new Point(oX, oY).multiply(r);
      const originProjP = view.viewToProject(originViewP);

      if (Math.abs(1 - scale) < 0.05) scale = 1;
      let dScale = first ? 1 : scale / lastScale;
      let aniCount = last ? 10 : 1;
      dScale = Math.pow(dScale, 1 / aniCount);
      const scaleView = () => {
        view.scale(dScale, originProjP);
        if (--aniCount > 0) requestAnimationFrame(scaleView);
      };
      scaleView();

      const [dX, dY] = [oX - lastOX, oY - lastOY];
      const transP = new Point(dX, dY).multiply(r / scale);
      view.translate(transP);

      if (!last) return [scale, [oX, oY], [elX, elY]];
      putCenterBack(view);
    },
    {
      scaleBounds: { max: 5, min: 0.3 },
      rubberband: 0.5,
      target: canvasEl,
    }
  );

  const touchHandler = usePreventTouch(finger);
  return (
    <div className="draw-wrapper">
      <canvas
        ref={canvasEl}
        className="draw-canvas"
        data-paper-hidpi={false}
        {...touchHandler}
      />
      {SelectTool && paperMode === "selected" && (
        <SelectTool
          onDelete={deleteSelected}
          onRotate={rotateSelected}
          onDuplicate={duplicateSelected}
          mutateStyle={mutateStyle}
          rasterize={rasterize}
          currDrawCtrl={currDrawCtrl}
        />
      )}
      {TextTool && pointText && mode === "text" && (
        <TextTool onCancel={cancelText} onSubmit={submitText} />
      )}
    </div>
  );
};

export default React.memo(Draw);

function usePaperItem<T extends paper.Item>(init?: T) {
  const stateArray = useState<T | undefined>(init);
  const [item] = stateArray;
  useEffect(() => () => void item?.remove(), [item]);
  return stateArray;
}

const paintStroke = (
  stroke: Stroke,
  scope: paper.PaperScope,
  group?: paper.Item[],
  erased = false
) => {
  let { pathData, uid } = stroke;
  try {
    scope.activate();
    const item = scope.project.activeLayer.importJSON(pathData);
    if (!item) return;
    item.name = uid;
    if (erased) item.opacity /= 2;
    group?.push(item);
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

const paintBackground = (
  scope: paper.PaperScope,
  width: number,
  height: number
) => {
  scope.activate();
  const bgRect = new Rectangle(new Point(0, 0), new Point(width, height));
  bgRect.fillColor = new Color("#fff");
  scope.project.addLayer(new paper.Layer()).activate();
  return bgRect;
};

const startSelectRect = (point: paper.Point) => {
  const rect = new Rectangle(point, new Size(0, 0));
  rect.strokeColor = new Color("#1890ff");
  rect.strokeWidth = 5;
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

const moveDash = (item: paper.Item) => {
  if (item.strokeColor) item.strokeColor.alpha /= 2;
  item.dashOffset = 0;
  item.dashArray = [30, 20];
  item.onFrame = () => (item.dashOffset += 3);
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
  let aniCount = 10;
  const dP = new Point(deltaX, deltaY).divide(-aniCount);
  const move = () => {
    view.translate(dP);
    if (--aniCount > 0) requestAnimationFrame(move);
  };
  move();
};

const parseGroupStyle = (group: paper.Group) => {
  const tempStyle: Partial<DrawCtrl> = {};
  if (group.strokeColor) tempStyle.color = group.strokeColor.toCSS(true);
  if (group.strokeWidth) tempStyle.lineWidth = group.strokeWidth;
  if (group.children.every((p) => p.strokeColor?.alpha === 0.5))
    tempStyle.highlight = true;
  return tempStyle;
};

const checkRectSelection = (rect: paper.Shape.Rectangle, items: paper.Item[]) =>
  items.filter((item) =>
    item instanceof paper.Path
      ? item.intersects(rect) || item.isInside(rect.bounds)
      : item.bounds.intersects(rect.bounds)
  );

const checkPathSelection = (selection: paper.Path, items: paper.Item[]) => {
  const isInside = (p: paper.Path) =>
    p.subtract(selection, { insert: false, trace: false }).isEmpty();

  return items.filter((item) => {
    if (!item.bounds.intersects(selection.bounds)) return false;
    let checkedP: paper.Path;
    if (item instanceof paper.Path) {
      checkedP = item;
    } else {
      checkedP = new Path.Rectangle(item.bounds);
      checkedP.remove();
    }
    return checkedP.intersects(selection) || isInside(checkedP);
  });
};

const updateGroupStyle = (
  group: paper.Group,
  updated: Partial<DrawCtrl>,
  prevHighLighted: boolean
) => {
  const { lineWidth, color, highlight } = updated;
  if (color) group.strokeColor = new Color(color);
  if (lineWidth) group.strokeWidth = lineWidth;
  if (highlight === true || prevHighLighted === true) {
    group.children.forEach((p) => {
      const { strokeColor } = p;
      if (!strokeColor) return;
      if (strokeColor.alpha === 1) strokeColor.alpha /= 2;
      p.blendMode = "multiply";
    });
  }
  if (highlight === false) {
    group.children.forEach((p) => {
      const { strokeColor } = p;
      if (!strokeColor) return;
      strokeColor.alpha = 1;
      p.blendMode = "normal";
    });
  }
};
