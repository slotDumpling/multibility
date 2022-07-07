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
import {
  DrawState,
  Mutation,
  Splitter,
  Stroke,
} from "../../lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "../../lib/draw/DrawCtrl";
import { usePreventTouch, usePreventGesture } from "./touch";
import { getCursorStyle, ROTATE_CURSOR } from "./cursor";
import { releaseCanvas } from "../../lib/draw/canvas";
import { usePinch } from "@use-gesture/react";
import useSize from "@react-hook/size";
import paper from "paper";
import "./draw.sass";

const { Path, Size, Point, Group, Color, Raster, Layer } = paper;

export type ActiveToolKey = "" | "select" | "text";
export interface DrawRefType {
  deleteSelected: () => void;
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
    const [rotateHandle, setRotateHandle] = usePaperItem<paper.Path>();

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
      scp.project.layers[2].activate();
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
      scp.view.update();

      return () => {
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
        raster.view.update();
        raster.fitBounds(new paper.Rectangle(0, 0, width, height));
        raster.bringToFront();
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
      const layer = scope.current.project.layers[1];

      scope.current.activate();
      mergedStrokes.forEach((stroke) => {
        const self = drawState.hasStroke(stroke.uid);
        const item = paintStroke(stroke, layer, !self);
        if (!item) return;
        if (self) tempGroup.push(item);
      });
      setGroup(tempGroup);

      return () => void layer.removeChildren();
    }, [mergedStrokes, drawState]);

    const hitRef = useRef<paper.HitResult>();
    const [selected, setSelected] = useState(false);
    const paperMode = mode === "select" && selected ? "selected" : mode;
    const [chosenIDs, setChosenIDs] = useState<string[]>([]);
    const chosenItems = useMemo(() => {
      const IDSet = new Set(chosenIDs);
      return group.filter((item) => IDSet.has(item.name));
    }, [group, chosenIDs]);

    const resetSelect = useCallback(() => {
      setSelected(false);
      setPath(undefined);
      setRect(undefined);
      setRotateHandle(undefined);
    }, [setPath, setRect, setRotateHandle]);

    useEffect(() => {
      if (mode === "select") return resetSelect;
    }, [mode, resetSelect]);
    useEffect(() => resetSelect, [lasso, resetSelect]);

    useEffect(() => {
      if (!selected) return;
      return () => {
        setChosenIDs([]);
        setActiveTool("");
      };
    }, [selected, setActiveTool]);

    const downPath = () => setPath(startStroke(drawCtrl));
    const downRect = (e: paper.MouseEvent) => setRect(startRect(e.point));

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
          let hitRes =
            rect?.hitTest(e.point, { segments: true }) ??
            rotateHandle?.hitTest(e.point, { segments: true, selected: true });
          hitRef.current = hitRes;
          if (hitRes) return;

          // if the point is outside of selection, reset selection
          if (rect?.contains(e.point)) return;
          downRect(e);
          setRotateHandle(undefined);
          setSelected(false);
        }
      },
      text(e: paper.MouseEvent) {
        const layer = scope.current.project.layers[1];
        const t =
          getClickedText(layer, e.point) ??
          new paper.PointText({
            point: e.point.add(new Point(0, 50)),
            content: "Insert text...",
            fontSize: 50,
            justification: "center",
            fillColor: "#1890ff55",
          });
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
        if (hitRes?.segment && rect) {
          const segment = hitRes.segment;
          const rotating = segment.selected;
          if (rotating) {
            // rotate select items
            const { center } = rect.bounds;
            const axis = segment.point.subtract(center);
            const line = e.point.subtract(center);
            const angle = line.angle - axis.angle;
            rect.rotate(angle, center);
            rotateHandle?.rotate(angle, center);
            chosenItems.forEach((item) => item?.rotate(angle, center));
          } else {
            // resize selected items
            const moveP = segment.point;
            const baseP = segment.next.next.point;
            const diagonal = moveP.subtract(baseP);
            const projection = e.point.subtract(baseP).project(diagonal);
            const scale = projection.x / diagonal.x;
            if (scale < 0) return;

            rect.scale(scale, baseP);
            rotateHandle?.scale(scale, baseP);
            chosenItems.forEach((item) => {
              item.scale(scale, baseP);
              item.strokeWidth *= scale;
            });
          }
        } else {
          // move selected items
          chosenItems.forEach((item) => item.translate(e.delta));
          path?.translate(e.delta);
          rect?.translate(e.delta);
          rotateHandle?.translate(e.delta);
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
    const replaced = useRef(new Map<string, paper.Item>());

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
              if (!(item instanceof paper.Path)) return;
              let topItem: paper.PathItem = item;
              while (topItem.parent !== layer) {
                if (!(topItem.parent instanceof paper.PathItem)) break;
                topItem = topItem.parent;
              }
              const { name } = topItem;

              if (drawCtrl.pixelEraser) {
                const radius = (eraserWidth + item.strokeWidth) / 2;
                const circle = new Path.Circle(e.point, radius);
                circle.remove();

                const sub = item.subtract(circle, { trace: false });
                item.replaceWith(sub);
                if (topItem === item) topItem = sub;
                replaced.current.set(name, topItem);
              } else {
                topItem.opacity = 0.5;
                topItem.guide = true;
                erased.current.add(name);
              }
            });
          }
        : null;

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
        if (drawCtrl.pixelEraser) {
          const items = Array.from(replaced.current);
          replaced.current.clear();
          const splitters = items.map(([uid, item]) => {
            const paths = flattenCP(item);
            return [uid, paths.map((i) => i.exportJSON())] as Splitter;
          });
          if (!splitters.length) return;
          onChange((prev) => DrawState.splitStrokes(prev, splitters));
        } else {
          const erasedList = Array.from(erased.current);
          erased.current.clear();
          if (!erasedList.length) return;
          onChange((prev) => DrawState.eraseStrokes(prev, erasedList));
        }
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
          const link = new Path();
          const { topCenter } = rect.bounds;
          link.add(topCenter, topCenter.subtract(new Point(0, 50)));
          link.lastSegment.selected = true;
          setRotateHandle(link);
        }
        setSelected(true);
        setChosenIDs(selection);
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
        setCursor(getCursorStyle(drawCtrl, ratio));
      }
    }, [paperMode, lasso, drawCtrl, ratio]);

    const handleMove = {
      selected(e: paper.MouseEvent) {
        const hitRes =
          rect?.hitTest(e.point, { segments: true }) ??
          rotateHandle?.hitTest(e.point, { segments: true, selected: true });
        if (hitRes?.segment) {
          if (hitRes.segment.selected) return setCursor(ROTATE_CURSOR);
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
        const layer = scope.current.project.layers[1];
        if (getClickedText(layer, e.point)) setCursor("text");
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
      if (!chosenItems?.length) return;
      const mutations = chosenItems.map(
        (p) => [p.name, p.exportJSON()] as Mutation
      );
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
    };

    const deleteSelected = () => {
      setChosenIDs([]);
      resetSelect();
      if (!chosenIDs.length) return;
      onChange((prev) => DrawState.eraseStrokes(prev, chosenIDs));
    };

    const mutateStyle = (updated: Partial<DrawCtrl>) => {
      scope.current.activate();
      updateGroupStyle(chosenItems, updated);
      updateMutation();
    };

    const duplicateSelected = () => {
      scope.current.activate();
      const size = (rect || path)?.bounds.size;
      if (!size || !chosenItems.length) return;
      const { width, height } = size;
      const transP = new Point(width, height).divide(10);
      const copies = chosenItems.map((item) => item.clone());
      copies.forEach((item) => item.translate(transP));
      rect?.translate(transP);
      path?.translate(transP);

      const mutations = copies.map(
        (item) => [DrawState.getUid(), item.exportJSON()] as Mutation
      );
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
      setChosenIDs(mutations.map(([uid]) => uid));
    };

    const rasterize = () => {
      const g = new Group(chosenItems);
      g.addTo(scope.current.project.layers[1]);
      return g.rasterize({ insert: false }).toDataURL();
    };

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
      <div
        className="draw-wrapper"
        style={{ cursor }}
        data-readonly={readonly}
        {...touchHandler}
      >
        <canvas ref={canvasEl} className="draw-canvas" />
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

const startRect = (point: paper.Point) => {
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
        return isInside(checkedP) || selection.isInside(item.bounds);
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

const getClickedText = (layer: paper.Layer, point: paper.Point) => {
  const hitRes = layer.hitTest(point, {
    class: paper.PointText,
    fill: true,
  });
  return hitRes?.item;
};

const flattenCP = (cp: paper.Item): paper.Path[] => {
  if (cp instanceof paper.Path) {
    return cp.isEmpty() ? [] : [cp];
  }
  if (cp instanceof paper.CompoundPath) {
    return cp.children.map(flattenCP).flat();
  }
  return [];
};
