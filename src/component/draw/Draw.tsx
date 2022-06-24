import React, {
  useRef,
  useMemo,
  useState,
  Dispatch,
  useEffect,
  useCallback,
  useDebugValue,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { usePreventTouch, usePreventGesture } from "../../lib/touch/touch";
import { DrawState, Mutation, Stroke } from "../../lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { releaseCanvas } from "../../lib/draw/canvas";
import { usePinch } from "@use-gesture/react";
import { v4 as getUid } from "uuid";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

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

export type ActiveToolKey = "" | "select" | "text";
export interface DrawRefType {
  deleteSelected: () => void;
  rotateSelected: (angle: number, last?: boolean) => void;
  duplicateSelected: () => void;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
  rasterize: () => string;
  submitText: (text: string, fontSize: number, color: string) => void;
  cancelText: () => void;
}
interface DrawPropType {
  drawState: DrawState;
  otherStates?: DrawState[];
  onChange?: Dispatch<SetStateAction<DrawState>>;
  setActiveTool?: Dispatch<SetStateAction<ActiveToolKey>>;
  drawCtrl?: DrawCtrl;
  readonly?: boolean;
  preview?: boolean;
  imgSrc?: string;
}

const Draw = React.forwardRef<DrawRefType, DrawPropType>(
  (
    {
      drawState,
      otherStates,
      onChange = () => {},
      drawCtrl = defaultDrawCtrl,
      preview = false,
      readonly = preview,
      imgSrc,
      setActiveTool,
    },
    ref
  ) => {
    const { width, height } = drawState;
    const { mode, color, finger, lineWidth, highlight, eraserWidth, lasso } =
      drawCtrl;

    const canvasEl = useRef<HTMLCanvasElement>(null);
    const scope = useRef(new paper.PaperScope());
    const [group, setGroup] = useState<paper.Item[]>([]);
    const [erased, setErased] = useState(Set<string>());
    const [path, setPath] = usePaperItem<paper.Path>();
    const [rect, setRect] = usePaperItem<paper.Shape.Rectangle>();

    useEffect(() => {
      const cvs = canvasEl.current;
      const scp = scope.current;
      if (!cvs) return;

      scp.setup(cvs);
      const r = preview ? PREVIEW_WIDTH / width : 1;
      scp.view.viewSize = new Size(width, height).multiply(r);
      scp.view.scale(r, new Point(0, 0));
      paintBackground(scp, width, height);

      return () => {
        scp.remove();
        releaseCanvas(cvs);
      };
    }, [width, height, preview]);

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
      const tempGroup: paper.Item[] = [];
      const othersGroup: paper.Item[] = [];

      mergedStrokes.forEach((stroke) =>
        paintStroke(
          stroke,
          scope.current,
          drawState.hasStroke(stroke.uid) ? tempGroup : othersGroup,
          erased.has(stroke.uid)
        )
      );
      setGroup(tempGroup);

      return () => {
        tempGroup.forEach((item) => item.remove());
        othersGroup.forEach((item) => item.remove());
      };
    }, [mergedStrokes, erased, drawState]);

    const [selected, setSelected] = useState(false);
    const paperMode = mode === "select" && selected ? "selected" : mode;
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
    const selectedItems = useMemo(() => {
      const IDSet = Set(selectedIDs);
      return group.filter((item) => IDSet.has(item.name));
    }, [group, selectedIDs]);

    const resetSelect = useCallback(() => {
      setSelected(false);
      setPath(undefined);
      setRect(undefined);
    }, [setPath, setRect]);

    useEffect(() => {
      if (mode === "select") return resetSelect;
    }, [mode, resetSelect]);

    useEffect(() => {
      if (selected) return () => setSelectedIDs([]);
    }, [selected]);

    useEffect(() => resetSelect, [lasso, resetSelect]);

    const ratio = useRef(1);
    const updateRatio = () => {
      const clientWidth = canvasEl.current?.clientWidth;
      if (clientWidth) ratio.current = width / clientWidth;
      scope.current.activate();
    };

    const setNewRect = (e: paper.MouseEvent) => {
      const point = transformPoint(e.point);
      const rectangle = startSelectRect(point);
      setRect(rectangle);
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

    const handleDown = {
      draw() {
        updateRatio();
        setPath(startStroke(color, lineWidth, highlight));
      },
      erase() {
        updateRatio();
        setPath(startStroke("#ccc", eraserWidth, true));
      },
      select(e: paper.MouseEvent) {
        updateRatio();
        if (lasso) setPath(startStroke("#1890ff", 5));
        else setNewRect(e);
      },
      selected(e: paper.MouseEvent) {
        updateRatio();
        const point = transformPoint(e.point);
        // check if point is outside of selection
        if (lasso) {
          if (path?.contains(point)) return;
          setPath(startStroke("#1890ff", 5));
        } else {
          if (rect?.bounds.contains(point)) return;
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
        path.add(transformPoint(e.point));
        path.smooth();
      },
      erase(e: paper.MouseEvent) {
        if (!path) return;
        scope.current.activate();
        path.add(transformPoint(e.point));
        path.smooth();

        const newErased = group
          .filter((p) => !erased.has(p.name))
          .filter((p) => checkErase(p, path))
          .map((p) => p.name);
        setErased((prev) => prev.concat(newErased));
      },
      select(e: paper.MouseEvent) {
        scope.current.activate();
        if (lasso) {
          if (!path) return;
          path.add(transformPoint(e.point));
          path.smooth();
        } else {
          if (!rect) return;
          const delta = e.delta.multiply(ratio.current);
          rect.size = rect.size.add(new Size(delta.x, delta.y));
          rect.translate(delta.divide(2));
        }
      },
      selected(e: paper.MouseEvent) {
        scope.current.activate();
        const delta = e.delta.multiply(ratio.current);
        selectedItems.forEach((item) => item.translate(delta));
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
        setPath(undefined);
        onChange((prev) => DrawState.addStroke(prev, pathData));
      },
      erase() {
        if (!path) return;
        scope.current.activate();
        setPath(undefined);
        onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
        setErased(Set());
      },
      select() {
        scope.current.activate();
        let items: paper.Item[];
        if (lasso) {
          if (!path || path.length < 50) return setPath(undefined);
          path.closePath();
          path.simplify();
          moveDash(path);
          items = checkPathSelection(path, group);
        } else {
          if (!rect) return;
          const { width, height } = rect.size.abs();
          if (width * height < 100) return setRect(undefined);
          moveDash(rect);
          items = checkRectSelection(rect, group);
        }
        setSelectedIDs(items.map((item) => item.name));
        setSelected(true);
      },
      selected() {
        updateMutation();
      },
      text: null,
    }[paperMode];

    const handlePaper = () => {
      if (readonly) return;
      scope.current.view.onMouseDown = handleDown;
      scope.current.view.onMouseDrag = handleDrag;
      scope.current.view.onMouseUp = handleUp;
    };
    useEffect(handlePaper);

    const updateMutation = () => {
      if (!selectedItems?.length) return;
      const mutations = selectedItems.map(
        (p) => [p.name, p.exportJSON()] as Mutation
      );
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
    };

    const deleteSelected = () => {
      if (!selectedIDs.length) return;
      onChange((prev) => DrawState.eraseStrokes(prev, selectedIDs));
      setSelectedIDs([]);
      resetSelect();
    };

    const rotateSelected = (angle: number, last = false) => {
      let aniCount = last ? 10 : 1;
      const dAngle = angle / aniCount;
      const center = (rect || path)?.position;
      const rotate = () => {
        selectedItems.forEach((item) => item.rotate(dAngle, center));
        rect?.rotate(dAngle, center);
        path?.rotate(dAngle, center);
        if (--aniCount > 0) requestAnimationFrame(rotate);
        else last && updateMutation();
      };
      rotate();
    };

    const mutateStyle = (updated: Partial<DrawCtrl>) => {
      scope.current.activate();
      updateGroupStyle(selectedItems, updated);
      updateMutation();
    };

    const duplicateSelected = () => {
      scope.current.activate();
      const size = (rect || path)?.bounds.size;
      if (!size) return;
      const { width, height } = size;
      const transP = new Point(width, height).divide(10);
      const newSG = new Group(selectedItems).clone({ insert: false });
      newSG.translate(transP);
      rect?.translate(transP);
      path?.translate(transP);

      const mutations = newSG.children.map(
        (item) => [getUid(), item.exportJSON()] as Mutation
      );
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
      setSelectedIDs(mutations.map((m) => m[0]));
    };

    const rasterize = () =>
      new Group(selectedItems).rasterize({ insert: false }).toDataURL();

    const [pointText, setPointText] = usePaperItem<paper.PointText>();
    const cancelText = useCallback(
      () => setPointText(undefined),
      [setPointText]
    );

    useEffect(() => {
      if (mode === "text") return cancelText;
    }, [mode, cancelText]);

    const submitText = (text: string, fontSize: number, color = "#000") => {
      if (!pointText) return;
      pointText.content = text;
      pointText.fontSize = fontSize * 10;
      pointText.fillColor = new Color(color);
      const pathData = pointText.exportJSON();
      onChange((prev) => DrawState.addStroke(prev, pathData));
      cancelText();
    };

    useImperativeHandle(ref, () => ({
      deleteSelected,
      duplicateSelected,
      cancelText,
      rotateSelected,
      submitText,
      mutateStyle,
      rasterize,
    }));

    useEffect(() => {
      if (!setActiveTool) return;
      if (paperMode === "selected") {
        setActiveTool("select");
      } else if (paperMode === "text") {
        setActiveTool(pointText ? "text" : "");
      } else {
        setActiveTool("");
      }
    }, [paperMode, pointText, setActiveTool]);

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
          else if (last) putCenterBack(view);
        };
        scaleView();

        const [dX, dY] = [oX - lastOX, oY - lastOY];
        const transP = new Point(dX, dY).multiply(r / scale);
        view.translate(transP);

        if (!last) return [scale, [oX, oY], [elX, elY]];
      },
      {
        scaleBounds: { max: 10, min: 0.3 },
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
      </div>
    );
  }
);

Draw.displayName = "Draw";
export default React.memo(Draw);

function usePaperItem<T extends paper.Item>(init?: T) {
  const stateArray = useState<T | undefined>(init);
  const [item] = stateArray;
  useDebugValue(item);
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
    if (erased) item.opacity = 0.5;
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

const checkErase = (item: paper.Item, eraserPath: paper.Path) => {
  const curveBound = eraserPath.lastSegment.curve?.strokeBounds;
  if (!(item instanceof paper.Path)) return false;
  if (!curveBound?.intersects(item.strokeBounds)) return false;

  if (eraserPath.intersects(item)) return true;

  const { strokeWidth, lastSegment } = eraserPath;
  const checkPoints = getCheckPoints(lastSegment, strokeWidth);
  return checkPoints.some((cPoint) => {
    const d = item.getNearestPoint(cPoint)?.getDistance(cPoint);
    return d && d * 2 < item.strokeWidth + strokeWidth;
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
  const bgLayer = new paper.Layer(bgRect);
  scope.project.insertLayer(0, bgLayer);
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
    strokeColor.alpha = 0.5;
    path.blendMode = "multiply";
  }
  path.strokeColor = strokeColor;
  path.strokeWidth = lineWidth;
  path.strokeJoin = "round";
  path.strokeCap = "round";
  return path;
};

const moveDash = (item: paper.Item) => {
  if (item.strokeColor) item.strokeColor.alpha = 0.5;
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

const checkRectSelection = (rect: paper.Shape.Rectangle, items: paper.Item[]) =>
  items.filter((item) =>
    item instanceof paper.Path
      ? item.intersects(rect) || item.isInside(rect.bounds)
      : item.bounds.intersects(rect.bounds)
  );

const checkPathSelection = (selection: paper.Path, items: paper.Item[]) => {
  const isInside = (p: paper.Path) => {
    const res = p.subtract(selection, { insert: false, trace: false });
    res.remove();
    return res.isEmpty();
  };

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

const updateGroupStyle = (items: paper.Item[], updated: Partial<DrawCtrl>) => {
  const { lineWidth, color, highlight } = updated;
  items.forEach((item) => {
    if (item instanceof paper.PointText) {
      if (color) {
        const newColor = new Color(color);
        item.fillColor = newColor;
      }
    }

    if (!(item instanceof paper.Path)) return;

    if (color) {
      const newColor = new Color(color);
      if (item.blendMode === "multiply") newColor.alpha = 0.5;
      item.strokeColor = newColor;
    }

    if (lineWidth) item.strokeWidth = lineWidth;

    if (!item.strokeColor || highlight === undefined) return;
    item.strokeColor.alpha = highlight ? 0.5 : 1;
    item.blendMode = highlight ? "multiply" : "normal";
  });
};
