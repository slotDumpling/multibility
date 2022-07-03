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
import { DrawState, Mutation, Stroke } from "../../lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "../../lib/draw/drawCtrl";
import { usePreventTouch, usePreventGesture } from "./touch";
import { releaseCanvas } from "../../lib/draw/canvas";
import { usePinch } from "@use-gesture/react";
import useSize from "@react-hook/size";
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
  submitText: (text: string, color?: string, justification?: string) => void;
  cancelText: () => void;
  pointText?: paper.PointText;
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
    const { mode, finger, lasso, eraserWidth } = drawCtrl;

    const canvasEl = useRef<HTMLCanvasElement>(null);
    const scope = useRef(new paper.PaperScope());
    const [group, setGroup] = useState<paper.Item[]>([]);
    const [path, setPath] = usePaperItem<paper.Path>();
    const [rect, setRect] = usePaperItem<paper.Path.Rectangle>();

    useEffect(() => {
      const cvs = canvasEl.current;
      const scp = scope.current;
      if (!cvs) return;

      scp.setup(cvs);
      scp.settings.handleSize = 10;
      scp.settings.hitTolerance = 20;
      scp.project.addLayer(new Layer());
      scp.project.addLayer(new Layer());
      scp.project.addLayer(new Layer());
      scp.project.layers[1].activate();
      scp.project.layers.forEach((l) => (l.visible = false));
      new scp.Tool();

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
    const ratio = canvasWidth / width;
    useEffect(() => {
      if (!ratio) return;
      const scp = scope.current;
      scp.view.viewSize = new Size(width, height).multiply(ratio);
      scp.view.scale(ratio, new Point(0, 0));
      scp.project.layers.forEach((l) => (l.visible = true));

      return () => {
        scp.project?.layers.forEach((l) => (l.visible = false));
        scp.view?.scale(1 / ratio, new Point(0, 0));
      };
    }, [width, height, ratio]);

    useEffect(() => {
      if (!imgSrc) return;
      scope.current.activate();
      const raster = new Raster(imgSrc);
      raster.project.layers[0].addChild(raster);
      raster.sendToBack();
      raster.onLoad = () => {
        // render the image in full size first to prevent blurring.
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

      scope.current.activate();
      const layer = scope.current.project.layers[1];
      mergedStrokes.forEach((stroke) => {
        const { uid } = stroke;
        const self = drawState.hasStroke(uid);
        const item = paintStroke(stroke, layer, !self);
        if (!item) return;

        if (self) tempGroup.push(item);
        else othersGroup.push(item);
      });
      setGroup(tempGroup);

      return () => {
        tempGroup.forEach((item) => item.remove());
        othersGroup.forEach((item) => item.remove());
      };
    }, [mergedStrokes, drawState]);

    const hitRef = useRef<paper.HitResult>();
    const [selected, setSelected] = useState(false);
    const paperMode = mode === "select" && selected ? "selected" : mode;
    const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
    const selectedItems = useMemo(() => {
      const IDSet = new Set(selectedIDs);
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
      if (!selected) return;
      return () => {
        setSelectedIDs([]);
        setActiveTool("");
      };
    }, [selected, setActiveTool]);

    const downPath = () => {
      const p = startStroke(drawCtrl);
      scope.current.project.layers[2].addChild(p);
      setPath(p);
    };
    const downRect = (e: paper.MouseEvent) => {
      const r = startSelectRect(e.point);
      scope.current.project.layers[2].addChild(r);
      setRect(r);
    };

    const handleDown = {
      draw: downPath,
      erase: downPath,
      select: lasso ? downPath : downRect,
      selected(e: paper.MouseEvent) {
        if (lasso) {
          // if the point is outside of selection, reset selection
          if (path?.contains(e.point)) return;
          downPath();
          setSelected(false);
        } else {
          // check if the point hit the segment point.
          const hitRes = rect?.hitTest(e.point, { segments: true });
          hitRef.current = hitRes;
          if (hitRes) return;
          // if the point is outside of selection, reset selection
          if (rect?.contains(e.point)) return;
          downRect(e);
          setSelected(false);
        }
      },
      text(e: paper.MouseEvent) {
        let t = getClickedText(scope.current, e.point);
        if (!t) {
          t = new paper.PointText({
            point: e.point.add(new Point(0, 50)),
            content: "Insert text...",
            fontSize: 50,
            justification: "center",
            fillColor: "#1890ff55",
          });
          scope.current.project.layers[2].addChild(t);
        }
        setPointText(t as paper.PointText);
      },
    }[paperMode];

    const dragPath = (e: paper.MouseEvent) => {
      path?.add(e.point);
      path?.smooth();
    };
    const resizeRect = (e: paper.MouseEvent) => {
      if (!rect) return;
      const { x, y } = e.point;
      const [, s1, s2, s3] = rect.segments;
      s1.point.x = x;
      s2.point = e.point;
      s3.point.y = y;
    };

    const handleDrag = {
      draw: dragPath,
      erase: dragPath,
      select: lasso ? dragPath : resizeRect,
      selected(e: paper.MouseEvent) {
        const hitRes = hitRef.current;
        if (hitRes?.segment) {
          // resize selected items
          const moveP = hitRes.segment.point;
          const baseP = hitRes.segment.next.next.point;
          const diagonal = moveP.subtract(baseP);
          const projection = e.point.subtract(baseP).project(diagonal);
          const scale = projection.x / diagonal.x;
          if (scale < 0) return;

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
      text(e: paper.MouseEvent) {
        if (!pointText || pointText.name) return;
        const { topCenter, bottomRight } = pointText.bounds;
        const diagonal = bottomRight.subtract(topCenter);
        const projection = e.point.subtract(topCenter).project(diagonal);
        const scale = projection.x / diagonal.x;
        if (scale < 0) return;
        pointText.scale(scale, topCenter);
      },
    }[paperMode];

    useEffect(() => {
      scope.current.tool.maxDistance = eraserWidth;
    }, [eraserWidth]);
    const erased = useRef(new Set<string>());

    const handleEarserDrag =
      paperMode === "erase"
        ? (e: paper.ToolEvent) => {
            const layer = scope.current.project.layers[1];
            const hitRes = layer.hitTestAll(e.point, {
              class: paper.Path,
              stroke: true,
              tolerance: eraserWidth / 2,
            });

            hitRes.forEach(({ item }) => {
              item.opacity = 0.5;
              item.guide = true;
              if (item.name) erased.current.add(item.name);
            });
          }
        : null;

    const handleUp = {
      draw() {
        if (!path || path.isEmpty()) return;
        path.simplify();
        const pathData = path.exportJSON();
        onChange((prev) => DrawState.addStroke(prev, pathData));
        setPath(undefined);
      },
      erase() {
        const erasedList = Array.from(erased.current);
        erased.current.clear();
        onChange((prev) => DrawState.eraseStrokes(prev, erasedList));
        setPath(undefined);
      },
      select() {
        let selection: string[];
        if (lasso) {
          if (!path || Math.abs(path.area) < 1_000) return setPath(undefined);
          path.closePath();
          path.simplify();
          moveDash(path);
          selection = checkLasso(group, path);
        } else {
          if (!rect || Math.abs(rect.area) < 1_000) return setRect(undefined);
          selection = checkLasso(group, rect);
        }
        setSelectedIDs(selection);
        setSelected(true);
        setActiveTool("select");
      },
      selected() {
        updateMutation();
      },
      text() {
        setActiveTool("text");
      },
    }[paperMode];

    const [cursor, setCursor] = useState("auto");
    useEffect(() => {
      if (paperMode === "text" || paperMode === "select") {
        setCursor("crosshair");
      } else if (paperMode === "selected") {
        setCursor(lasso ? "crosshair" : "nwse-resize");
      } else if (paperMode === "draw" || paperMode === "erase") {
        setCursor(cursorStyle(drawCtrl, ratio));
      }
    }, [paperMode, lasso, drawCtrl, ratio]);

    const handleMove = {
      selected(e: paper.MouseEvent) {
        const hitRes = rect?.hitTest(e.point, { segments: true });
        if (hitRes?.segment) {
          const moveP = hitRes.segment.point;
          const baseP = hitRes.segment.next.next.point;
          const diagonal = moveP.subtract(baseP);
          const { x, y } = diagonal;
          setCursor(x * y < 0 ? "nesw-resize" : "nwse-resize");
        } else if (rect?.contains(e.point) || path?.contains(e.point)) {
          setCursor("move");
        } else {
          setCursor("crosshair");
        }
      },
      text(e: paper.MouseEvent) {
        if (getClickedText(scope.current, e.point)) setCursor("text");
        else setCursor("crosshair");
      },
      select: null,
      draw: null,
      erase: null,
    }[paperMode];

    const handleViewEvent = () => {
      if (readonly) return;

      type Handler<E> = ((e: E) => boolean | void) | null;
      const activate = <E,>(handler: Handler<E>): Handler<E> => {
        return (e) => {
          scope.current.activate();
          if (handler) return handler(e);
        };
      };
      const { view, tool } = scope.current;
      view.onMouseDown = activate(handleDown);
      view.onMouseDrag = activate(handleDrag);
      view.onMouseUp = activate(handleUp);
      view.onMouseMove = activate(handleMove);
      if (tool) tool.onMouseDrag = activate(handleEarserDrag);
    };
    useEffect(handleViewEvent);

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
        (item) => [DrawState.getUid(), item.exportJSON()] as Mutation
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

    const submitText = (
      text: string,
      color = "#000",
      justification = "center"
    ) => {
      if (!pointText) return;
      pointText.content = text;
      pointText.fillColor = new Color(color);
      pointText.justification = justification;
      const pathData = pointText.exportJSON();
      const { name } = pointText;
      cancelText();
      if (!name) return onChange((prev) => DrawState.addStroke(prev, pathData));
      onChange((prev) => DrawState.mutateStrokes(prev, [[name, pathData]]));
    };

    useImperativeHandle(ref, () => ({
      deleteSelected,
      duplicateSelected,
      cancelText,
      rotateSelected,
      submitText,
      mutateStyle,
      rasterize,
      pointText,
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
      <div className="draw-wrapper" style={{ cursor }}>
        <canvas ref={canvasEl} className="draw-canvas" {...touchHandler} />
      </div>
    );
  }
);

Draw.displayName = "Draw";
export default React.memo(Draw);

function usePaperItem<T extends paper.Item>() {
  const tuple = useState<T | undefined>();
  const [item] = tuple;
  useDebugValue(item);
  useEffect(
    () => () => {
      if (!item?.name) item?.remove();
    },
    [item]
  );
  return tuple;
}

const paintStroke = (stroke: Stroke, layer: paper.Layer, readonly = false) => {
  let { pathData, uid } = stroke;
  try {
    const item = layer.importJSON(pathData);
    if (!item) return;
    item.name = uid;
    item.guide = readonly;
    return item;
  } catch (e) {
    console.error(e);
  }
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
  rect.onFrame = () => {}; // the handle size bug
  rect.selected = true;
  return rect;
};

const startStroke = (drawCtrl: DrawCtrl) => {
  let { mode, lineWidth, eraserWidth, color, highlight } = drawCtrl;
  const path = new Path();
  if (mode === "erase") {
    color = "#ccc";
    lineWidth = eraserWidth;
  }
  if (mode === "select") {
    color = "#1890ff";
    lineWidth = 5;
  }
  const strokeColor = new Color(color);
  if (highlight || mode === "erase") {
    strokeColor.alpha = 0.5;
    path.blendMode = "multiply";
  }
  path.strokeColor = strokeColor;
  path.strokeWidth = lineWidth;
  path.strokeJoin = "round";
  path.strokeCap = "round";
  path.guide = true;
  return path;
};

const cursorStyle = (drawCtrl: DrawCtrl, ratio: number) => {
  const { lineWidth, eraserWidth, mode } = drawCtrl;
  const size = ratio * (mode === "erase" ? eraserWidth : lineWidth);
  if (size < 5) return "crosshair";
  const half = size / 2;
  return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23FFF7" width="${size}" height="${size}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>') ${half} ${half}, auto`;
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

const checkLasso = (items: paper.Item[], selection: paper.Path) => {
  const isInside = (p: paper.Path) => {
    const res = p.subtract(selection, { insert: false, trace: false });
    res.remove();
    return !res.compare(p);
  };
  return items
    .filter((item) => {
      if (!item.name) return false;
      if (!item.bounds.intersects(selection.bounds)) return false;
      if (item instanceof paper.Path) {
        return isInside(item);
      } else {
        const checkedP = new Path.Rectangle(item.bounds);
        checkedP.remove();
        return isInside(checkedP);
      }
    })
    .map(({ name }) => name);
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

const getClickedText = (scope: paper.PaperScope, point: paper.Point) => {
  const hitRes = scope.project.hitTest(point, {
    class: paper.PointText,
    fill: true,
  });
  return hitRes?.item;
};
