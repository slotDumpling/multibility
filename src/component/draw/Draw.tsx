import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  TouchEvent,
} from "react";
import { DrawState, Mutation, Stroke } from "../../lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { Setter, usePreventGesture } from "../../lib/hooks";
import { releaseCanvas } from "../../lib/draw/canvas";
import { isStylus } from "../../lib/touch/touch";
import { usePinch } from "@use-gesture/react";
import { v4 as getUid } from "uuid";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

export type SelectToolType = FC<{
  onDelete: () => void;
  onRotate: (angle: number, smooth?: boolean) => void;
  onDuplicate: () => void;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
  rasterize: () => string;
  currDrawCtrl: DrawCtrl;
}>;

export type TextToolType = FC<{
  onSubmit: (text: string, fontSize: number) => void;
  onCancel: () => void;
}>;

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
  onChange = () => {},
  otherStates,
  drawCtrl = defaultDrawCtrl,
  preview = false,
  readonly = preview,
  imgSrc,
  SelectTool,
  TextTool,
}) => {
  const { width, height } = drawState;
  const { mode, color, finger, lineWidth, highlight, eraserWidth } = drawCtrl;

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const scope = useRef(new paper.PaperScope());
  const group = useRef<paper.Item[]>([]);
  const path = useRef<paper.Path>();
  const [erased, setErased] = useState(Set<string>());
  const [currDrawCtrl, setCurrDrawCtrl] = useState(defaultDrawCtrl);

  const [rect, setRect] = useState<paper.Shape.Rectangle>();
  useEffect(() => {
    if (!rect) return;
    rect.onFrame = () => (rect.dashOffset += 3);
    return () => void rect.remove();
  }, [rect]);

  const [selectedGroup, setSelectedGroup] = useState<paper.Group>();
  useEffect(() => () => void selectedGroup?.remove(), [selectedGroup]);

  const [selected, setSelected] = useState(false);
  const paperMode = mode === "select" && selected ? "selected" : mode;
  useEffect(() => {
    if (mode !== "select") {
      setSelected(false);
      setRect(undefined);
    }
    if (mode !== "text") {
      setPointText(undefined);
    }
  }, [mode]);
  useEffect(() => {
    if (selected) {
      if (!rect?.strokeColor) return;
      rect.strokeColor.alpha /= 2;
    } else {
      updateMutation();
      setSelectedGroup(undefined);
      setCurrDrawCtrl(defaultDrawCtrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const ratio = useRef(1);
  const updateRatio = () => {
    const clientWidth = canvasEl.current?.clientWidth;
    if (clientWidth) ratio.current = width / clientWidth;
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
  }, [height, width, preview]);

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
      const point = transformPoint(e.point);
      if (rect && point.isInside(rect.strokeBounds)) return;
      setNewRect(e);
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
        .filter((p) => !erased.has(p.name))
        .filter((p) => p instanceof paper.Path && checkErase(p, eraserPath))
        .map((p) => p.name);
      setErased((prev) => prev.concat(newErased));
    },
    select(e: paper.MouseEvent) {
      if (!rect) return;
      scope.current.activate();
      const delta = e.delta.multiply(ratio.current);
      rect.size = rect.size.add(new Size(delta.x, delta.y));
      rect.translate(delta.divide(2));
    },
    selected(e: paper.MouseEvent) {
      if (!rect || !selectedGroup) return;
      scope.current.activate();
      const delta = e.delta.multiply(ratio.current);
      rect.translate(delta);
      selectedGroup.translate(delta);
    },
    text() {},
  }[paperMode];

  const handleUp = {
    draw() {
      if (!path.current || path.current.segments.length === 0) return;
      scope.current.activate();
      path.current.simplify();
      const pathData = path.current.exportJSON();
      path.current.remove();
      onChange((prev) => DrawState.addStroke(prev, pathData));
    },
    erase() {
      if (!path.current) return;
      scope.current.activate();
      path.current.remove();
      onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
      setErased(Set());
    },
    select() {
      if (!rect) return;
      const { width, height } = rect.size.abs();
      if (width < 10 || height < 10) return setRect(undefined);

      scope.current.activate();
      const items = group.current;
      const newSG = new Group(checkSelection(rect, items));
      setSelectedGroup(newSG);
      const tempStyle = parseGroupStyle(newSG);
      setCurrDrawCtrl((prev) => ({ ...prev, ...tempStyle }));
      setSelected(true);
    },
    selected() {},
    text() {},
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
        ? DrawState.mergeStates([drawState, ...otherStates])
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
    setRect(undefined);
    setSelectedGroup(undefined);
    setSelected(false);
  };

  const rotateSelected = (angle: number, smooth = false) => {
    if (!selectedGroup) return;
    let count = smooth ? 10 : 1;
    const dAngle = angle / count;
    const rotate = () => {
      selectedGroup.rotate(dAngle, rect?.position);
      rect?.rotate(dAngle, rect.position);
      if (--count > 0) requestAnimationFrame(rotate);
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
    scope.current.activate();
    if (!rect || !selectedGroup) return;
    const newSG = selectedGroup.clone();
    updateMutation();
    setSelectedGroup(newSG);

    const { width, height } = rect.size;
    const transP = new Point(width, height).divide(10);
    newSG.translate(transP);
    rect.translate(transP);
    newSG.children.forEach((p) => (p.name = getUid()));
  };

  const rasterize = () => {
    if (!selectedGroup) return "";
    const raster = selectedGroup.rasterize();
    const data = raster.toDataURL();
    raster.remove();
    return data;
  };

  const [pointText, setPointText] = useState<paper.PointText>();
  useEffect(() => () => void pointText?.remove(), [pointText]);

  const submitText = (text: string, fontSize: number) => {
    if (!pointText) return;
    pointText.content = text;
    pointText.fontSize = fontSize;
    const pathData = pointText.exportJSON();
    onChange((prev) => DrawState.addStroke(prev, pathData));
    setPointText(undefined);
  };
  const cancelText = () => setPointText(undefined);

  usePreventGesture();
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
      } else [lastScale, [lastOX, lastOY], [osX, osY]] = memo;

      const { view } = scope.current;
      if (Math.abs(1 - offset[0]) < 0.05) offset[0] = 1;

      let scale = first ? 1 : offset[0] / lastScale;
      const r = ratio.current;
      const [oX, oY] = [origin[0] - osX, origin[1] - osY];
      const originViewP = new Point(oX, oY).multiply(r);
      const originProjP = view.viewToProject(originViewP);

      let aniCount = last ? 10 : 1;
      scale = Math.pow(scale, 1 / aniCount);
      const scaleView = () => {
        view.scale(scale, originProjP);
        if (--aniCount > 0) requestAnimationFrame(scaleView);
      };
      scaleView();

      const [dX, dY] = [oX - lastOX, oY - lastOY];
      const transP = new Point(dX, dY).multiply(r / offset[0]);
      view.translate(transP);

      if (!last) return [offset[0], [oX, oY], [osX, osY]];
      putCenterBack(view);
    },
    {
      scaleBounds: { max: 5, min: 0.3 },
      rubberband: 0.5,
      target: canvasEl,
    }
  );

  const isEventValid = (e: TouchEvent) =>
    isStylus(e) || (finger && e.touches.length === 1);
  const preventTouch = (e: TouchEvent) =>
    isEventValid(e) || e.stopPropagation();

  return (
    <div className="draw-wrapper">
      <canvas
        ref={canvasEl}
        className="draw-canvas"
        data-paper-hidpi={false}
        onTouchStartCapture={preventTouch}
        onTouchMoveCapture={preventTouch}
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
  const dP = new Point(deltaX, deltaY).divide(-count);
  const move = () => {
    view.translate(dP);
    if (--count > 0) requestAnimationFrame(move);
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

const checkSelection = (rect: paper.Shape.Rectangle, items: paper.Item[]) => {
  const bounds = rect.strokeBounds;
  return items.filter((item) =>
    item instanceof paper.Path
      ? item.isInside(bounds) || item.intersects(rect)
      : item.bounds.intersects(rect.bounds)
  );
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
