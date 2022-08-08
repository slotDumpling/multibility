import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useDebugValue,
  useImperativeHandle,
} from "react";
import paper, {
  Path,
  Size,
  Point,
  Color,
  Raster,
  Layer,
  Rectangle,
} from "paper/dist/paper-core";
import { usePinch } from "@use-gesture/react";
import useSize from "@react-hook/size";
import { DrawState, Mutation, Splitter, Stroke } from "lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "lib/draw/DrawCtrl";
import { releaseCanvas } from "lib/draw/canvas";
import { getCircleCursor, getRotateCurcor } from "./cursor";
import { usePreventTouch, usePreventGesture } from "./touch";
import { Setter } from "lib/hooks";

export interface DrawRefType {
  deleteSelected: () => void;
  duplicateSelected: () => void;
  rasterizeSelected: () => string;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
  submitText: (text: string, color?: string, justification?: string) => void;
  cancelText: () => void;
  pointText?: paper.PointText;
  clickPoint: paper.Point;
}
interface DrawPropType {
  drawState: DrawState;
  otherStates?: DrawState[];
  onChange?: Setter<DrawState>;
  setSelectShow?: Setter<boolean>;
  setTextShow?: Setter<boolean>;
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
      setSelectShow = () => {},
      setTextShow = () => {},
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
        raster.fitBounds(new Rectangle(projSize));
        raster.bringToFront();
      };
      setImgRaster(raster);
    }, [imgSrc, projSize, setImgRaster]);

    const mergedStrokes = useMemo(
      () =>
        otherStates
          ? DrawState.mergeStates(drawState, ...otherStates)
          : drawState.getStrokeList(),
      [drawState, otherStates]
    );

    const renderSlow = useRef(false);
    const deferRender = useRef(false);
    const deferTimerID = useRef(0);

    useEffect(() => {
      const layer = scope.current.project.layers[1];
      if (!layer) return;
      const render = () => {
        const tempGroup: paper.Item[] = [];
        const timeBeforeRender = performance.now();
        scope.current.activate();
        // clean-up layer_1 except the clip mask.
        layer.removeChildren(1);
        mergedStrokes.forEach((stroke) => {
          const self = drawState.hasStroke(stroke.uid);
          const item = paintStroke(stroke, layer, !self);
          if (self) tempGroup.push(item);
        });
        setGroup(tempGroup);

        unrasterizeCanvas();
        pathClones.current.forEach((c) => c.remove());
        pathClones.current = [];

        scope.current.view.update();
        const duration = performance.now() - timeBeforeRender;
        renderSlow.current = duration > 16;
      };

      if (deferRender.current) {
        deferTimerID.current = window.setTimeout(render, 1000);
      } else render();

      // cancel previous render timer.
      return () => window.clearTimeout(deferTimerID.current);
    }, [mergedStrokes, drawState]);
    useEffect(() => void (deferRender.current = false), [drawState]);

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
        setSelectShow(false);
      };
    }, [selected, setSelectShow]);

    const layerRaster = useRef<paper.Raster>();
    const rasterizeLayer = (clip: paper.Path, force = false) => {
      if (!renderSlow.current && !force) return;
      const [l0, l1] = scope.current.project.layers;
      if (!l0 || !l1) return;
      l1.visible = true;
      clip.clipMask = true;
      const prevClip = l1.firstChild;
      prevClip.replaceWith(clip);
      imgRaster?.insertAbove(clip);

      const dpi = 72 * devicePixelRatio;
      const resolution = (canvasWidth / clip.bounds.width) * dpi;
      let raster = layerRaster.current;
      raster = layerRaster.current = l1.rasterize({ raster, resolution });
      raster.visible = true;

      l1.visible = false;
      clip.replaceWith(prevClip);
      imgRaster?.addTo(l0);
    };
    const unrasterizeLayer = () => {
      scope.current.activate();
      const [, l1] = scope.current.project.layers;
      const lr = layerRaster.current;
      if (!l1 || !lr) return;
      l1.visible = true;
      lr.visible = false;
    };

    const canvasRaster = useRef<paper.Raster>();
    // raster changes with the size of canvas element
    useEffect(
      () => () => {
        canvasRaster.current?.remove();
        canvasRaster.current = undefined;
      },
      [canvasWidth]
    );
    const rasterizeCanvas = () => {
      if (!renderSlow.current) return;
      // rasterize the canvas only once
      if (canvasRaster.current?.visible === true) return;
      scope.current.activate();
      const { view } = scope.current;
      // create a raster of the canvas element's size only once.
      const raster = (canvasRaster.current ??= new Raster(
        view.viewSize.multiply(window.devicePixelRatio)
      ));
      raster.drawImage(view.element, P_ZERO);
      raster.fitBounds(view.bounds);
      raster.visible = true;
      raster.opacity = process.env.NODE_ENV === "production" ? 1 : 0.8;
      const [, l1] = scope.current.project.layers;
      l1 && (l1.visible = false);
    };
    const unrasterizeCanvas = () => {
      scope.current.activate();
      deferRender.current = false;
      const [, l1] = scope.current.project.layers;
      const cr = canvasRaster.current;
      const lr = layerRaster.current;
      if (!l1 || !cr) return;
      cr.visible = false;
      // keep layer_1 hidden unless all 2 raster is hidden.
      if (lr?.visible !== true) l1.visible = true;
    };

    const downPath = (e: paper.MouseEvent) => {
      rasterizeCanvas();
      setPath(startStroke(drawCtrl, e.point, renderSlow.current));
    };
    const downRect = (e: paper.MouseEvent) => {
      rasterizeCanvas();
      setRect(startRect(e.point));
    };
    const pointBeforeDrag = useRef(P_ZERO);

    const handleDown = {
      draw(e: paper.MouseEvent) {
        deferRender.current = renderSlow.current;
        downPath(e);
      },
      erase: downPath,
      select: lasso ? downPath : downRect,
      selected(e: paper.MouseEvent) {
        setSelectShow(false);
        pointBeforeDrag.current = e.point;
        if (lasso) {
          // if the point is outside of selection, reset selection
          if (path?.contains(e.point)) return;
          setSelected(false);
          downPath(e);
        } else {
          // check if the point hit the segment point.
          let hitRes =
            rect?.hitTest(e.point, { segments: true }) ??
            rotateHandle?.hitTest(e.point, { segments: true, selected: true });
          hitRef.current = hitRes;
          if (hitRes) return;

          // if the point is outside of selection, reset selection
          if (rect?.contains(e.point)) return;
          setRotateHandle(undefined);
          setSelected(false);
          downRect(e);
        }
      },
      text(e: paper.MouseEvent) {
        const layer = scope.current.project.layers[1];
        if (!layer) return;
        rasterizeCanvas();
        const t = getClickedText(layer, e.point) ?? startText(e.point);
        setPointText(t);
      },
    }[paperMode];

    const dragPath = (e: paper.MouseEvent) => {
      // cancel previous render timer.
      window.clearTimeout(deferTimerID.current);
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
      if (!/^(erase|select)$/.test(mode)) return [];
      const wnum = Math.ceil(width / 100);
      const hnum = Math.ceil(height / 100);
      const grid = Array.from({ length: wnum }, () =>
        Array.from({ length: hnum }, () => new Set<paper.Item>())
      );
      group.forEach((item) => setGridItem(grid, item));
      return grid;
    }, [group, width, height, mode]);

    const handleToolDrag = (e: paper.ToolEvent) => {
      const layer = scope.current.project.layers[1];
      if (paperMode !== "erase" || !layer) return;
      const ew = eraserWidth;

      const hitOption = { class: paper.Path, stroke: true, tolerance: ew / 2 };
      const bounds = new Rectangle(e.point.subtract(ew), new Size(ew, ew));

      getGridItems(itemGrid, bounds).forEach((item) => {
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
            const radius = (ew + item.strokeWidth) / 2;
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

    const pathClones = useRef<paper.Path[]>([]);
    const [clickPoint, setClickPoint] = useState(P_ZERO);
    const handleUp = {
      draw() {
        if (!path || path.segments.length <= 1) {
          // if canvas is clicked without any path in queue.
          if (!pathClones.current.length) unrasterizeCanvas();
          return;
        }
        path.simplify();
        if (renderSlow.current) pathClones.current.push(path.clone());
        const pathData = path.exportJSON();
        onChange((prev) => DrawState.addStroke(prev, pathData));
        setPath(undefined);
      },
      erase() {
        unrasterizeCanvas();
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
        unrasterizeCanvas();
        let selection: string[];
        if (lasso) {
          if (!path || Math.abs(path.area) < 1_000) return setPath(undefined);
          path.closePath();
          path.simplify();
          if (!renderSlow.current) moveDash(path);
          const items = getGridItems(itemGrid, path.bounds);
          selection = checkLasso(items, path);
        } else {
          if (!rect || Math.abs(rect.area) < 1_000) return setRect(undefined);
          const items = getGridItems(itemGrid, rect.bounds);
          selection = checkLasso(items, rect);
          const link = new Path();
          const { topCenter } = rect.bounds;
          link.add(topCenter, topCenter.subtract(new Point(0, 100)));
          link.lastSegment.selected = true;
          setRotateHandle(link);
        }
        setSelected(true);
        setChosenIDs(selection);
      },
      selected(e: paper.MouseEvent) {
        handleSelectedCursor(e);
        if (pointBeforeDrag.current.equals(e.point)) return;
        updateMutation();
      },
      text() {
        unrasterizeCanvas();
        setTextShow(true);
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
      if ((rect ?? path)?.contains(e.point)) return setCursor("pointer");
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

    const handleKeyUp = (e: paper.KeyEvent) => {
      if (paperMode !== "selected") return;
      if (/^(delete|backspace)$/.test(e.key)) deleteSelected();
    };

    const handleClick = (e: paper.MouseEvent) => {
      if (paperMode !== "selected") return;
      if (!(rect ?? path)?.contains(e.point)) return;
      if (e.delta.subtract(P_ZERO).length > 10) return;
      const { view } = scope.current;
      const cp = view.projectToView(e.point);
      setClickPoint(cp);
      setSelectShow(true);
    };

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
      view.onClick = activate(handleClick);
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

      const pathDataList = copies.map((item) => item.exportJSON());
      const IDs: string[] = [];
      onChange((prev) => DrawState.addStrokes(prev, pathDataList, IDs));
      setChosenIDs(IDs);
      setSelectShow(false);
    };

    const rasterizeSelected = () => {
      scope.current.activate();
      const clip = (rect ?? path)?.clone();
      clip && rasterizeLayer(clip, true);
      unrasterizeLayer();
      return layerRaster.current?.toDataURL() ?? "";
    };

    const [pointText, setPointText] = usePaperItem<paper.PointText>();
    const cancelText = useCallback(() => {
      setPointText(undefined);
      setTextShow(false);
    }, [setPointText, setTextShow]);

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
      clickPoint,
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
          const { x, y } = view.element.getBoundingClientRect();
          lastScale = 1;
          elPos = new Point(x, y);
          lastOrigin = originRawP.subtract(elPos);
          setSelectShow(false);
          rasterizeLayer(new Path.Rectangle(P_ZERO, projSize));
          unrasterizeCanvas();
        } else {
          [lastScale, lastOrigin, elPos] = memo;
        }

        const originViewP = originRawP.subtract(elPos);
        const originPorjP = view.viewToProject(originViewP);

        const deltaP = originViewP.subtract(lastOrigin);
        const transP = deltaP.divide(view.zoom);
        view.translate(transP);

        let dScale = first ? 1 : scale / lastScale;
        scope.current.settings.hitTolerance /= dScale;
        view.scale(dScale, originPorjP);

        if (last) {
          Promise.all([
            putCenterBack(view, projSize),
            scaleView(view, originPorjP, dScale),
          ]).then(unrasterizeLayer);
          view.scale(1 / dScale, originPorjP);
        } else {
          return [scale, originViewP, elPos];
        }
      },
      {
        scaleBounds: { max: 5, min: 1 },
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
  const tuple = useState<T>();
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

const startStroke = (drawCtrl: DrawCtrl, point: paper.Point, slow = false) => {
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
  if ((mode === "draw" && highlight) || (mode === "erase" && !slow)) {
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
  new Promise<void>((resolve) => {
    if (Math.abs(dScale - 1) < 0.05) {
      view.scale(dScale, originPorjP);
      return resolve();
    }
    let aniCount = 10;
    dScale = Math.pow(dScale, 1 / aniCount);
    const scale = () => {
      view.scale(dScale, originPorjP);
      if (--aniCount > 0) requestAnimationFrame(scale);
      else requestAnimationFrame(() => resolve());
    };
    scale();
  });

const getTargetCenter = (view: paper.View, projSize: paper.Size) => {
  const { x, y } = view.center;
  const minSize = Size.min(view.size, projSize).divide(2);
  const { width: minX, height: minY } = minSize;
  const { width: maxX, height: maxY } = projSize.subtract(minSize);

  const targetX = x < minX ? minX : x > maxX ? maxX : x;
  const targetY = y < minY ? minY : y > maxY ? maxY : y;
  return new Point(targetX, targetY);
};

const putCenterBack = (view: paper.View, projSize: paper.Size) =>
  new Promise<void>((resolve) => {
    const targetCenter = getTargetCenter(view, projSize);
    if (view.center.equals(targetCenter)) return resolve();
    let aniCount = 10;
    const move = () => {
      const delta = view.center.subtract(targetCenter);
      view.translate(delta.divide(aniCount));
      if (--aniCount > 0) requestAnimationFrame(move);
      else requestAnimationFrame(() => resolve());
    };
    requestAnimationFrame(move);
  });

const checkLasso = (items: paper.Item[], selection: paper.Path) => {
  const isInside = (p: paper.Path) => {
    if (selection.segments.length === 4 && p.isInside(selection.bounds)) {
      return true;
    }
    return !p.subtract(selection, { insert: false, trace: false }).compare(p);
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

const getGridRange = (bounds: paper.Rectangle) => {
  const { topLeft, bottomRight } = bounds;
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
  const [xmin, xmax, ymin, ymax] = getGridRange(bounds);
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      replaced && grid[x]?.[y]?.delete(replaced);
      grid[x]?.[y]?.add(item);
    }
  }
};

const getGridItems = (grid: Set<paper.Item>[][], bounds: paper.Rectangle) => {
  const itemSet = new Set<paper.Item>();
  const [xmin, xmax, ymin, ymax] = getGridRange(bounds);
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      grid[x]?.[y]?.forEach((item) => itemSet.add(item));
    }
  }
  return Array.from(itemSet);
};
