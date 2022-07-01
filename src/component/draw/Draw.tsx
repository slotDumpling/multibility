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
import useSize from "@react-hook/size";
import { v4 as getUid } from "uuid";
import { Set } from "immutable";
import paper from "paper";
import "./draw.sass";

const { Path, Size, Point, Group, Color, Raster, Layer } = paper;

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
  imgSrc?: string;
}
type PaperHandler = ((e: paper.MouseEvent) => boolean | void) | null;

const Draw = React.forwardRef<DrawRefType, DrawPropType>(
  (
    {
      drawState,
      otherStates,
      onChange = () => {},
      drawCtrl = defaultDrawCtrl,
      readonly = false,
      imgSrc,
      setActiveTool = () => {},
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
    const [rect, setRect] = usePaperItem<paper.Path.Rectangle>();

    useEffect(() => {
      const cvs = canvasEl.current;
      const scp = scope.current;
      if (!cvs) return;

      scp.setup(cvs);
      scp.settings.handleSize = 10;
      scp.settings.hitTolerance = 40;
      scp.project.addLayer(new Layer());
      scp.project.addLayer(new Layer());
      scp.project.layers[1].activate();
      scp.project.layers.forEach((l) => (l.visible = false));

      return () => {
        scp.remove();
        releaseCanvas(cvs);
      };
    }, []);

    useEffect(() => {
      const bgRect = paintBackground(scope.current, width, height);
      return () => void bgRect.remove();
    }, [width, height]);

    const [canvasWidth] = useSize(canvasEl);
    useEffect(() => {
      if (!canvasWidth) return;
      const scp = scope.current;
      const ratio = canvasWidth / width;
      scp.view.viewSize = new Size(width, height).multiply(ratio);
      scp.view.scale(ratio, new Point(0, 0));
      scp.project.layers.forEach((l) => (l.visible = true));

      return () => {
        scp.project?.layers.forEach((l) => (l.visible = false));
        scp.view?.scale(1 / ratio, new Point(0, 0));
      };
    }, [width, height, canvasWidth]);

    useEffect(() => {
      if (!imgSrc) return;
      scope.current.activate();
      const raster = new Raster(imgSrc);
      raster.project.layers[0].addChild(raster);
      raster.sendToBack();
      raster.onLoad = () => {
        requestAnimationFrame(() => {
          raster.fitBounds(new paper.Rectangle(0, 0, width, height));
          raster.bringToFront();
        });
      };

      return () => void raster?.remove();
    }, [imgSrc, width, height]);

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

      mergedStrokes.forEach((stroke) => {
        const { uid } = stroke;
        const item = paintStroke(stroke, scope.current, erased.has(uid));
        if (!item) return;

        if (drawState.hasStroke(uid)) tempGroup.push(item);
        else othersGroup.push(item);
      });
      setGroup(tempGroup);

      return () => {
        tempGroup.forEach((item) => item.remove());
        othersGroup.forEach((item) => item.remove());
      };
    }, [mergedStrokes, erased, drawState]);

    const hitRef = useRef<paper.HitResult>();
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
    useEffect(() => resetSelect, [lasso, resetSelect]);

    useEffect(() => {
      if (selected)
        return () => {
          setSelectedIDs([]);
          setActiveTool("");
        };
    }, [selected, setActiveTool]);

    const handleDown = {
      draw() {
        setPath(startStroke(color, lineWidth, highlight));
      },
      erase() {
        setPath(startStroke("#ccc", eraserWidth, true));
      },
      select(e: paper.MouseEvent) {
        if (lasso) setPath(startStroke("#1890ff", 5));
        else setRect(startSelectRect(e.point));
      },
      selected(e: paper.MouseEvent) {
        if (lasso) {
          // if the point is outside of selection, reset selection
          if (path?.contains(e.point)) return;
          setPath(startStroke("#1890ff", 5));
        } else {
          // check if the point hit the segment point.
          const hitRes = rect?.hitTest(e.point, { segments: true });
          hitRef.current = hitRes;
          if (hitRes) return;
          // if the point is outside of selection, reset selection
          if (rect?.contains(e.point)) return;
          setRect(startSelectRect(e.point));
        }
        setSelected(false);
      },
      text(e: paper.MouseEvent) {
        const t = new paper.PointText(e.point);
        setPointText(t);
        setActiveTool("text");
      },
    }[paperMode];

    const handleDrag = {
      draw(e: paper.MouseEvent) {
        path?.add(e.point);
        path?.smooth();
      },
      erase(e: paper.MouseEvent) {
        if (!path) return;
        path.add(e.point);
        path.smooth();

        const newErased = group
          .filter((p) => !erased.has(p.name))
          .filter((p) => checkErase(p, path))
          .map((p) => p.name);
        setErased((prev) => prev.concat(newErased));
      },
      select(e: paper.MouseEvent) {
        if (lasso) {
          path?.add(e.point);
          path?.smooth();
        } else if (rect) {
          resizeRect(rect, e.delta);
        }
      },
      selected(e: paper.MouseEvent) {
        const hitRes = hitRef.current;
        if (hitRes) {
          // resize selected items
          const moveP = hitRes.segment.point;
          const baseP = hitRes.segment.next.next.point;
          const diagonal = moveP.subtract(baseP);
          const projection = e.point.subtract(baseP).project(diagonal);
          const scale = projection.x / diagonal.x;

          rect?.scale(scale, baseP);
          selectedItems.forEach((item) => {
            item.scale(scale, baseP);
            item.strokeWidth *= scale;
          });
        } else {
          // move selected items
          selectedItems.forEach((item) => item.translate(e.delta));
          path?.translate(e.delta);
          rect?.translate(e.delta);
        }
      },
      text: null,
    }[paperMode];

    const handleUp = {
      draw() {
        if (!path || path.isEmpty()) return;
        path.simplify();
        const pathData = path.exportJSON();
        setPath(undefined);
        onChange((prev) => DrawState.addStroke(prev, pathData));
      },
      erase() {
        setPath(undefined);
        onChange((prev) => DrawState.eraseStrokes(prev, erased.toArray()));
        setErased(Set());
      },
      select() {
        let selection: string[];
        if (lasso) {
          if (!path || Math.abs(path.area) < 1_000) return setPath(undefined);
          path.closePath();
          path.simplify();
          moveDash(path);
          selection = checkPathSelection(path, group);
        } else {
          if (!rect || Math.abs(rect.area) < 1_000) return setRect(undefined);
          selection = checkRectSelection(rect, group);
        }
        setSelectedIDs(selection);
        setSelected(true);
        setActiveTool("select");
      },
      selected() {
        updateMutation();
      },
      text: null,
    }[paperMode];

    const handlePaper = () => {
      if (readonly) return;

      const activate =
        (handler: PaperHandler): PaperHandler =>
        (e) => {
          scope.current.activate();
          if (handler) return handler(e);
        };

      scope.current.view.onMouseDown = activate(handleDown);
      scope.current.view.onMouseDrag = activate(handleDrag);
      scope.current.view.onMouseUp = activate(handleUp);
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
      setSelectedIDs([]);
      resetSelect();
      if (!selectedIDs.length) return;
      onChange((prev) => DrawState.eraseStrokes(prev, selectedIDs));
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
    const cancelText = useCallback(() => {
      setPointText(undefined);
      setActiveTool("");
    }, [setPointText, setActiveTool]);

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

    usePreventGesture();
    usePinch(
      ({ memo, offset: [scale], first, last, origin }) => {
        scope.current.activate();
        const { view } = scope.current;
        const originRawP = new Point(origin);

        let lastScale: number;
        let lastOrigin, elPos: paper.Point;
        if (first || !memo) {
          const { x, y } = canvasEl.current!.getBoundingClientRect();
          lastScale = 1;
          elPos = new Point(x, y);
          lastOrigin = originRawP.subtract(elPos);
        } else {
          [lastScale, lastOrigin, elPos] = memo;
        }

        const originViewP = originRawP.subtract(elPos);
        const originPorjP = view.viewToProject(originViewP);

        if (Math.abs(1 - scale) < 0.05) scale = 1;
        let dScale = first ? 1 : scale / lastScale;
        let aniCount = last ? 10 : 1;
        dScale = Math.pow(dScale, 1 / aniCount);
        const scaleView = () => {
          view.scale(dScale, originPorjP);
          if (--aniCount > 0) requestAnimationFrame(scaleView);
          else if (last) putCenterBack(view, new Size(width, height));
        };
        scaleView();

        const deltaP = originViewP.subtract(lastOrigin);
        const transP = deltaP.divide(view.zoom);
        view.translate(transP);

        if (!last) return [scale, originViewP, elPos];
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
        <canvas ref={canvasEl} className="draw-canvas" {...touchHandler} />
      </div>
    );
  }
);

Draw.displayName = "Draw";
export default React.memo(Draw);

function usePaperItem<T extends paper.Item>() {
  const stateArray = useState<T | undefined>();
  const [item] = stateArray;
  useDebugValue(item);
  useEffect(() => () => void item?.remove(), [item]);
  return stateArray;
}

const paintStroke = (
  stroke: Stroke,
  scope: paper.PaperScope,
  erased = false
) => {
  let { pathData, uid } = stroke;
  try {
    scope.activate();
    const item = scope.project.activeLayer.importJSON(pathData);
    if (!item) return;
    item.name = uid;
    if (erased) item.opacity = 0.5;
    return item;
  } catch (e) {
    console.error(e);
  }
};

const getCheckPoints = (() => {
  const cache = new WeakMap<paper.Segment, paper.Point[]>();
  return (segment: paper.Segment, strokeWidth: number) => {
    const cached = cache.get(segment);
    if (cached) return cached;

    const { point } = segment;
    const prevPoint = segment.previous?.point;
    if (!prevPoint) return [];
    const delta = point.subtract(prevPoint);
    const times = (delta.length / strokeWidth) * 2;
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
  const bgRect = new Path.Rectangle(new Point(0, 0), new Point(width, height));
  bgRect.fillColor = new Color("#fff");
  scope.project.layers[0].addChild(bgRect);
  return bgRect;
};

const startSelectRect = (point: paper.Point) => {
  const rect = new Path.Rectangle(point, new Size(0, 0));
  rect.strokeColor = new Color("#1890ff");
  rect.strokeWidth = 5;
  rect.onFrame = () => {}; // the handle size bug
  rect.selected = true;
  return rect;
};

const resizeRect = (rect: paper.Path.Rectangle, delta: paper.Point) => {
  const { x, y } = delta;
  const [, s1, s2, s3] = rect.segments;
  s1.point = s1.point.add(new Point(x, 0));
  s2.point = s2.point.add(delta);
  s3.point = s3.point.add(new Point(0, y));
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
  item.dashOffset = 0;
  item.dashArray = [30, 20];
  item.onFrame = () => (item.dashOffset += 3);
};

const getCenterTranslate = (view: paper.View, projSize: paper.Size) => {
  const { x, y } = view.center;
  const { width: viewW, height: viewH } = view.size;
  const { width: projW, height: projH } = projSize;

  const [minX, minY] = [Math.min(viewW, projW) / 2, Math.min(viewH, projH) / 2];
  const [maxX, maxY] = [projW - minX, projH - minY];

  const deltaX = x < minX ? minX - x : x > maxX ? maxX - x : 0;
  const deltaY = y < minY ? minY - y : y > maxY ? maxY - y : 0;

  return [deltaX, deltaY];
};

const putCenterBack = (view: paper.View, projSize: paper.Size) => {
  const [deltaX, deltaY] = getCenterTranslate(view, projSize);
  let aniCount = 10;
  const dP = new Point(deltaX, deltaY).divide(-aniCount);
  const move = () => {
    view.translate(dP);
    if (--aniCount > 0) requestAnimationFrame(move);
  };
  move();
};

const checkRectSelection = (rect: paper.Path.Rectangle, items: paper.Item[]) =>
  items
    .filter((item) =>
      item instanceof paper.Path
        ? item.intersects(rect) || item.isInside(rect.bounds)
        : item.bounds.intersects(rect.bounds)
    )
    .map((item) => item.name);

const checkPathSelection = (selection: paper.Path, items: paper.Item[]) => {
  const isInside = (p: paper.Path) => {
    const res = p.subtract(selection, { insert: false, trace: false });
    res.remove();
    return res.isEmpty();
  };

  return items
    .filter((item) => {
      if (!item.bounds.intersects(selection.bounds)) return false;
      let checkedP: paper.Path;
      if (item instanceof paper.Path) {
        checkedP = item;
      } else {
        checkedP = new Path.Rectangle(item.bounds);
        checkedP.remove();
      }
      return checkedP.intersects(selection) || isInside(checkedP);
    })
    .map((item) => item.name);
};

const updateGroupStyle = (items: paper.Item[], updated: Partial<DrawCtrl>) => {
  const { lineWidth, color, highlight } = updated;
  items.forEach((item) => {
    if (item instanceof paper.PointText && color) {
      const newColor = new Color(color);
      item.fillColor = newColor;
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
