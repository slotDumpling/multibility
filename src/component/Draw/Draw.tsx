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
import paper, {
  Path,
  Size,
  Point,
  Color,
  Raster,
  Layer,
} from "paper/dist/paper-core";
import { usePinch } from "@use-gesture/react";
import useSize from "@react-hook/size";
import { DrawState, Mutation, Splitter, Stroke } from "lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "lib/draw/DrawCtrl";
import { releaseCanvas } from "lib/draw/canvas";
import { getCircleCursor, getRotateCurcor } from "./cursor";
import { usePreventTouch, usePreventGesture } from "./touch";

export type ActiveToolKey = "" | "select" | "text";
export interface DrawRefType {
  deleteSelected: () => void;
  duplicateSelected: () => void;
  rasterizeSelected: () => string;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
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

const HIT_TOLERANCE = 20;
const P_ZERO = new Point(0, 0);

const DrawRaw = React.forwardRef<DrawRefType, DrawPropType>(
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
    const projSize = useMemo(() => new Size(width, height), [width, height]);
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
      scp.settings.hitTolerance = HIT_TOLERANCE;
      [0, 1, 2].forEach(() => (new Layer().visible = false));
      scp.project.layers[2]?.activate();
      new scp.Tool();

      return () => {
        scp.view?.remove();
        releaseCanvas(cvs);
      };
    }, []);

    useEffect(() => {
      scope.current.activate();
      const { layers } = scope.current.project;
      const rects = paintRects(layers, projSize);
      return () => rects.forEach((r) => r.remove());
    }, [projSize]);

    const [canvasWidth] = useSize(canvasEl);
    const ratio = canvasWidth / width;
    useEffect(() => {
      if (!ratio) return;
      const scp = scope.current;
      scp.view.viewSize = projSize.multiply(ratio);
      scp.view.scale(ratio, P_ZERO);
      scp.project.layers.forEach((l) => (l.visible = true));
      scp.view.update();

      return () => scp.view?.scale(1 / ratio, P_ZERO);
    }, [ratio, projSize]);

    const [imgRaster, setImgRaster] = usePaperItem();
    useEffect(() => {
      if (!imgSrc) return;
      scope.current.activate();
      const raster = new Raster(imgSrc);
      raster.project.layers[0]?.addChild(raster);
      raster.sendToBack();
      raster.onLoad = () => {
        raster.view.update();
        raster.fitBounds(new paper.Rectangle(0, 0, width, height));
        raster.bringToFront();
      };
      setImgRaster(raster);
    }, [imgSrc, width, height, setImgRaster]);

    const mergedStrokes = useMemo(
      () =>
        otherStates
          ? DrawState.mergeStates(drawState, ...otherStates)
          : drawState.getStrokeList(),
      [drawState, otherStates]
    );

    const renderSlow = useRef(false);
    useEffect(() => {
      const tempGroup: paper.Item[] = [];
      const layer = scope.current.project.layers[1];
      if (!layer) return;

      const timeBeforeRender = Date.now();
      scope.current.activate();
      mergedStrokes.forEach((stroke) => {
        const self = drawState.hasStroke(stroke.uid);
        const item = paintStroke(stroke, layer, !self);
        if (self) tempGroup.push(item);
      });
      setGroup(tempGroup);

      scope.current.view.update();
      requestAnimationFrame(() => {
        const duration = Date.now() - timeBeforeRender;
        renderSlow.current = duration > 32;
      });

      return () => void layer.removeChildren(1);
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

    const layerRaster = useRef<paper.Raster>();
    const pinching = useRef(false);
    const rasterizeLayer = (clip?: paper.Path.Rectangle, force = false) => {
      if (!renderSlow.current && !force) return;
      const [l0, l1] = scope.current.project.layers;
      const { view } = scope.current;
      if (!l0 || !l1) return;
      scope.current.activate();
      l1.visible = true;
      if (!clip) {
        clip = new Path.Rectangle(Size.min(view.size, projSize));
        clip.position = view.center;
      }
      clip.clipMask = true;
      const prevClip = l1.firstChild;
      prevClip.replaceWith(clip);
      if (imgRaster) l1.insertChild(1, imgRaster);

      const dpi = 72 * devicePixelRatio;
      const resolution = (canvasWidth / clip.bounds.width) * dpi;
      let raster = layerRaster.current;
      raster = l1.rasterize({ raster, resolution });
      layerRaster.current = raster;
      l0.addChild(raster);
      raster.visible = true;

      l1.visible = false;
      if (imgRaster) l0.insertChild(1, imgRaster);
      clip.replaceWith(prevClip);
      clip.remove();
    };
    const unrasterizeLayer = () => {
      const [, l1] = scope.current.project.layers;
      const lr = layerRaster.current;
      if (pinching.current || !l1 || !lr) return;
      l1.visible = true;
      lr.visible = false;
    };

    const downPath = (e: paper.MouseEvent) => {
      rasterizeLayer();
      setPath(startStroke(drawCtrl, e.point));
    };
    const downRect = (e: paper.MouseEvent) => {
      rasterizeLayer();
      setRect(startRect(e.point));
    };

    const handleDown = {
      draw: downPath,
      erase: downPath,
      select: lasso ? downPath : downRect,
      selected(e: paper.MouseEvent) {
        if (lasso) {
          // if the point is outside of selection, reset selection
          if (path?.contains(e.point)) return;
          downPath(e);
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
        if (!layer) return;
        const t = getClickedText(layer, e.point) ?? startText(e.point);
        setPointText(t);
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
      if (!s1 || !s2 || !s3) return;
      s1.point.x = x;
      s2.point = e.point;
      s3.point.y = y;
      rect.selected = true;
    };

    const handleDrag = {
      draw: dragPath,
      erase: dragPath,
      select: lasso ? dragPath : resizeRect,
      selected(e: paper.MouseEvent) {
        const hitRes = hitRef.current;
        if (hitRes?.segment && rect && rotateHandle) {
          const segment = hitRes.segment;
          const rotating = segment.selected;
          if (rotating) {
            // rotate select items
            const { center } = rect.bounds;
            const axis = segment.point.subtract(center);
            const line = e.point.subtract(center);
            setCursor(getRotateCurcor(line.angle));
            const angle = line.angle - axis.angle;
            rect.rotate(angle, center);
            rotateHandle.rotate(angle, center);
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
            chosenItems.forEach((item) => {
              item.scale(scale, baseP);
              item.strokeWidth *= scale;
            });
            rotateHandle.scale(scale, baseP);
            const rBaseP = rotateHandle.segments[0]?.point;
            if (!rBaseP) return;
            rotateHandle.scale(100 / rotateHandle.length, rBaseP);
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

    const itemGrid = useMemo(() => {
      if (paperMode !== "erase") return [];
      const wnum = Math.ceil(width / 100);
      const hnum = Math.ceil(height / 100);
      const grid = Array.from({ length: wnum }, () =>
        Array.from({ length: hnum }, () => new Set<paper.Item>())
      );
      group.forEach((item) => setGridItem(grid, item));
      return grid;
    }, [group, width, height, paperMode]);

    const handleToolDrag = (e: paper.ToolEvent) => {
      if (paperMode !== "erase") return;
      const layer = scope.current.project.layers[1];
      if (!layer) return;

      const hitOption = {
        class: paper.Path,
        stroke: true,
        tolerance: eraserWidth / 2,
      };

      getGridItems(itemGrid, e.point, eraserWidth).forEach((item) => {
        if (erased.current.has(item.name)) return;
        item.hitTestAll(e.point, hitOption)?.forEach(({ item }) => {
          if (!(item instanceof paper.Path)) return;
          let topItem: paper.PathItem = item;
          while (topItem.parent !== layer) {
            if (!(topItem.parent instanceof paper.PathItem)) break;
            topItem = topItem.parent;
          }
          const { name } = topItem;

          if (drawCtrl.pixelEraser) {
            const radius = (eraserWidth + item.strokeWidth) / 2;
            const circle = new Path.Circle({
              center: e.point,
              radius,
              insert: false,
            });

            const sub = item.subtract(circle, { trace: false });
            item.replaceWith(sub);
            if (topItem === item) {
              setGridItem(itemGrid, sub, item);
              topItem = sub;
            }
            replaced.current.set(name, topItem);
          } else {
            topItem.opacity = 0.5;
            topItem.guide = true;
            erased.current.add(name);
          }
        });
      });
    };

    const handleUp = {
      draw() {
        unrasterizeLayer();
        if (!path || path.segments.length <= 1) return;
        path.simplify();
        const pathData = path.exportJSON();
        setPath(undefined);
        onChange((prev) => DrawState.addStroke(prev, pathData));
      },
      erase() {
        unrasterizeLayer();
        setPath(undefined);
        if (drawCtrl.pixelEraser) {
          const items = Array.from(replaced.current);
          replaced.current.clear();
          const splitters: Splitter[] = items.map(([uid, item]) => {
            const paths = flattenCP(item);
            return [uid, paths.map((i) => i.exportJSON())];
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
        unrasterizeLayer();
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
          link.add(topCenter, topCenter.subtract(new Point(0, 100)));
          link.lastSegment.selected = true;
          setRotateHandle(link);
        }
        setSelected(true);
        setChosenIDs(selection);
        setActiveTool("select");
      },
      selected(e: paper.MouseEvent) {
        updateMutation();
        handleSelectedCursor(e);
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
        setCursor(getCircleCursor(drawCtrl, ratio));
      }
    }, [paperMode, lasso, drawCtrl, ratio]);

    const handleSelectedCursor = (e: paper.MouseEvent) => {
      const hitRes =
        rect?.hitTest(e.point, { segments: true }) ??
        rotateHandle?.hitTest(e.point, { segments: true, selected: true });
      if (hitRes?.segment) {
        if (hitRes.segment.selected) {
          const center = rect?.bounds.center;
          if (!center) return;
          const line = hitRes.segment.point.subtract(center);
          return setCursor(getRotateCurcor(line.angle));
        }
        const moveP = hitRes.segment.point;
        const baseP = hitRes.segment.next.next.point;
        const diagonal = moveP.subtract(baseP);
        const { x, y } = diagonal;
        return setCursor(x * y < 0 ? "nesw-resize" : "nwse-resize");
      }
      if ((rect ?? path)?.contains(e.point)) return setCursor("move");
      setCursor("crosshair");
    };

    const handleMove = {
      selected: handleSelectedCursor,
      text(e: paper.MouseEvent) {
        const layer = scope.current.project.layers[1];
        if (!layer) return;
        if (getClickedText(layer, e.point)) setCursor("text");
        else setCursor("crosshair");
      },
      ...{ select: null, draw: null, erase: null },
    }[paperMode];

    const handleKeyUp =
      paperMode === "selected"
        ? (e: paper.KeyEvent) => {
            if (["delete", "backspace"].includes(e.key)) {
              deleteSelected();
            }
          }
        : null;

    useEffect(() => {
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
      tool.onMouseDrag = activate(handleToolDrag);
      tool.onKeyUp = activate(handleKeyUp);
    });

    const updateMutation = () => {
      if (!chosenItems?.length) return;
      const mutations: Mutation[] = chosenItems.map((p) => [
        p.name,
        p.exportJSON(),
      ]);
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
    };

    const deleteSelected = () => {
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
      rotateHandle?.translate(transP);

      const mutations: Mutation[] = copies.map((item) => [
        DrawState.getUid(),
        item.exportJSON(),
      ]);
      onChange((prev) => DrawState.mutateStrokes(prev, mutations));
      setChosenIDs(mutations.map(([uid]) => uid));
    };

    const rasterizeSelected = () => {
      const bounds = (rect ?? path)?.bounds;
      if (!bounds) return "";
      const clip = new Path.Rectangle(bounds);
      rasterizeLayer(clip, true);
      unrasterizeLayer();
      return layerRaster.current?.toDataURL() ?? "";
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
      rasterizeSelected,
      mutateStyle,
      cancelText,
      submitText,
      pointText,
    }));

    usePreventGesture();
    usePinch(
      ({ memo, offset: [scale], first, last, origin }) => {
        scope.current.activate();
        const { view } = scope.current;
        const originRawP = new paper.Point(origin);

        let lastScale: number;
        let lastOrigin, elPos: paper.Point;
        if (first || !memo) {
          const { x, y } = canvasEl.current!.getBoundingClientRect();
          lastScale = 1;
          elPos = new Point(x, y);
          lastOrigin = originRawP.subtract(elPos);
          rasterizeLayer(new Path.Rectangle(P_ZERO, projSize));
          pinching.current = true;
        } else {
          [lastScale, lastOrigin, elPos] = memo;
        }

        const originViewP = originRawP.subtract(elPos);
        const originPorjP = view.viewToProject(originViewP);

        const deltaP = originViewP.subtract(lastOrigin);
        const transP = deltaP.divide(view.zoom);
        view.translate(transP);

        if (Math.abs(1 - scale) < 0.05) scale = 1;
        let dScale = first ? 1 : scale / lastScale;
        scope.current.settings.hitTolerance /= dScale;

        if (last) {
          scaleView(view, originPorjP, dScale)
            .then(() => putCenterBack(view, projSize))
            .then(() => (pinching.current = false))
            .then(unrasterizeLayer);
        } else {
          view.scale(dScale, originPorjP);
          return [scale, originViewP, elPos];
        }
      },
      {
        scaleBounds: { max: 5, min: 0.3 },
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

DrawRaw.displayName = "Draw";
export const Draw = React.memo(DrawRaw);

function usePaperItem<T extends paper.Item>() {
  const tuple = useState<T | undefined>();
  const [item] = tuple;
  useDebugValue(item);
  useEffect(() => {
    if (!item?.name) return () => void item?.remove();
  }, [item]);
  return tuple;
}

const paintStroke = (() => {
  const cacheMap = new WeakMap<
    paper.Layer,
    Map<string, { stroke: Stroke; item: paper.Item }>
  >();

  return (stroke: Stroke, layer: paper.Layer, readonly = false) => {
    const { pathData, uid } = stroke;
    const cache = cacheMap.get(layer) ?? new Map();
    cacheMap.set(layer, cache);
    const cached = cache.get(uid);
    let item: paper.Item;
    if (cached?.stroke === stroke) {
      layer.addChild(cached.item);
      item = cached.item;
    } else {
      try {
        item = layer.importJSON(pathData);
      } catch (e) {
        console.error(e);
      }
      item ??= new paper.Item();
      item.name = uid;
      cache.set(uid, { item, stroke });
    }
    item.opacity = 1;
    item.guide = readonly;
    return item;
  };
})();

const paintRects = (layers: paper.Layer[], projSize: paper.Size) => {
  const [l0, l1, l2] = layers;
  if (!l0 || !l1 || !l2) return [];
  const bgRect = new Path.Rectangle(P_ZERO, projSize);
  const clip1 = bgRect.clone();
  const clip2 = bgRect.clone();
  bgRect.fillColor = new Color("#fff");
  l0.addChild(bgRect);
  l1.addChild(clip1);
  l2.addChild(clip2);
  l1.clipped = true;
  l2.clipped = true;
  return [bgRect, clip1, clip2];
};

const startRect = (point: paper.Point) => {
  const rect = new Path.Rectangle(point, new Size(0, 0));
  rect.onFrame = () => {}; // the handle size bug
  return rect;
};

const startStroke = (drawCtrl: DrawCtrl, point: paper.Point) => {
  let { mode, lineWidth, eraserWidth, color, highlight } = drawCtrl;
  const path = new Path();
  path.add(point);
  if (mode === "erase") {
    color = "#ccc";
    lineWidth = eraserWidth;
  }
  if (mode === "select") {
    color = "#009dec";
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

const scaleView = (
  view: paper.View,
  originPorjP: paper.Point,
  dScale: number
) =>
  new Promise<void>((res) => {
    if (Math.abs(dScale - 1) < 0.05) {
      view.scale(dScale, originPorjP);
      return res();
    }
    let aniCount = 10;
    dScale = Math.pow(dScale, 1 / aniCount);
    const scale = () => {
      view.scale(dScale, originPorjP);
      if (--aniCount > 0) requestAnimationFrame(scale);
      else requestAnimationFrame(() => res());
    };
    scale();
  });

const getCenterTranslate = (
  view: paper.View,
  projSize: paper.Size
): [number, number] => {
  const { x, y } = view.center;
  const { width: viewW, height: viewH } = view.size;
  const { width: projW, height: projH } = projSize;

  const [minX, minY] = [Math.min(viewW, projW) / 2, Math.min(viewH, projH) / 2];
  const [maxX, maxY] = [projW - minX, projH - minY];

  const deltaX = x < minX ? minX - x : x > maxX ? maxX - x : 0;
  const deltaY = y < minY ? minY - y : y > maxY ? maxY - y : 0;

  return [deltaX, deltaY];
};

const putCenterBack = (view: paper.View, projSize: paper.Size) =>
  new Promise<void>((res) => {
    const [deltaX, deltaY] = getCenterTranslate(view, projSize);
    if (!deltaX && !deltaY) return res();
    let aniCount = 10;
    const dP = new Point(deltaX, deltaY).divide(-aniCount);
    const move = () => {
      view.translate(dP);
      if (--aniCount > 0) requestAnimationFrame(move);
      else requestAnimationFrame(() => res());
    };
    move();
  });

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
        return (
          (selection.segments.length === 4 &&
            item.isInside(selection.bounds)) ||
          isInside(item)
        );
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
  if (hitRes?.item instanceof paper.PointText) return hitRes?.item;
};

const startText = (point: paper.Point) => {
  return new paper.PointText({
    point: point.add(new Point(0, 50)),
    content: "Insert text...",
    fontSize: 50,
    justification: "center",
    fillColor: "#1890ff55",
  });
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

const getGridRange = (topLeft: paper.Point, bottomRight: paper.Point) => {
  return [
    Math.floor(topLeft.x / 100),
    Math.ceil(bottomRight.x / 100),
    Math.floor(topLeft.y / 100),
    Math.ceil(bottomRight.y / 100),
  ] as [number, number, number, number];
};

const setGridItem = (
  grid: Set<paper.Item>[][],
  item: paper.Item,
  replaced?: paper.Item
) => {
  const bounds = (replaced ?? item).strokeBounds;
  const { topLeft, bottomRight } = bounds;
  const [xmin, xmax, ymin, ymax] = getGridRange(topLeft, bottomRight);
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      replaced && grid[x]?.[y]?.delete(replaced);
      grid[x]?.[y]?.add(item);
    }
  }
};

const getGridItems = (
  grid: Set<paper.Item>[][],
  point: paper.Point,
  width: number
) => {
  const itemSet = new Set<paper.Item>();
  const [xmin, xmax, ymin, ymax] = getGridRange(
    point.subtract(width / 2),
    point.add(width / 2)
  );
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      grid[x]?.[y]?.forEach((item) => itemSet.add(item));
    }
  }
  return itemSet;
};
