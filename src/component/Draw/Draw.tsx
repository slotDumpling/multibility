import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useDebugValue,
  useImperativeHandle,
  useLayoutEffect,
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
import { usePinch, useWheel } from "@use-gesture/react";
import useSize from "@react-hook/size";
import { useMemoizedFn as useEvent } from "ahooks";
import { DrawState, Mutation, Splitter, Stroke } from "lib/draw/DrawState";
import { defaultDrawCtrl, DrawCtrl } from "lib/draw/DrawCtrl";
import { releaseCanvas } from "lib/draw/canvas";
import { getCircleCursor, getRotateCurcor } from "./cursor";
import { usePreventTouch, usePreventGesture } from "./touch";
import { Setter } from "lib/hooks";
import { setGridItem, getGridItems, gernerateGrid } from "./grid";

export interface DrawRefType {
  deleteSelected: () => void;
  duplicateSelected: () => void;
  rasterizeSelected: () => string;
  mutateStyle: (updated: Partial<DrawCtrl>) => void;
  mutatePointText: (cb: (prev: paper.PointText) => void) => void;
}
interface DrawPropType {
  drawState: DrawState;
  otherStates?: DrawState[];
  onChange?: Setter<DrawState>;
  toggleSelectTool?: (active: boolean, clickPoint?: paper.Point) => void;
  toggleTextTool?: (pt: paper.PointText | undefined, slow: boolean) => void;
  drawCtrl?: DrawCtrl;
  readonly?: boolean;
  imgSrc?: string;
}

const HIT_TOLERANCE = 20;
export const P_ZERO = new Point(0, 0);

const DrawRaw = React.forwardRef<DrawRefType, DrawPropType>(
  (
    {
      drawState,
      otherStates,
      onChange = () => {},
      drawCtrl = defaultDrawCtrl,
      readonly = false,
      imgSrc,
      toggleSelectTool = () => {},
      toggleTextTool = () => {},
    },
    ref
  ) => {
    const { width, height } = drawState;
    const projSize = useMemo(() => new Size(width, height), [width, height]);
    const { mode, finger, lasso, eraserWidth } = drawCtrl;

    const canvasEl = useRef<HTMLCanvasElement>(null);
    const scope = useRef(new paper.PaperScope());
    const [group, setGroup] = useState<paper.Item[]>([]);
    const [teamGroup, setTeamGroup] = useState<paper.Item[]>([]);
    const [path, setPath] = usePaperItem<paper.Path>();
    const [rotateHandle, setRotateHandle] = usePaperItem<paper.Path>();

    toggleSelectTool = useEvent(toggleSelectTool);
    toggleTextTool = useEvent(toggleTextTool);
    const showSelectTool = () => {
      if (!path) return;
      const bc = path.bounds.bottomCenter;
      const { view } = scope.current;
      toggleSelectTool(true, view.projectToView(bc));
    };

    useLayoutEffect(() => {
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
          : drawState.getStrokeMap(),
      [drawState, otherStates]
    );

    const renderSlow = useRef(false);

    const deferTimerID = useRef(0);
    const deferRender = useRef(false);
    const setDefer = () => (deferRender.current = renderSlow.current);
    if (readonly) setDefer();

    useEffect(() => {
      const [, l1] = scope.current.project.layers;
      if (!l1) return;
      const render = () => {
        scope.current.activate();
        const tempGroup: paper.Item[] = [];
        const tempTeamGroup: paper.Item[] = [];

        // clean-up layer_1 except the clip mask.
        l1.removeChildren(1);

        mergedStrokes.forEach((stroke) => {
          const self = drawState.hasStroke(stroke.uid);
          const item = paintStroke(stroke, l1);
          if (self && item) tempGroup.push(item);
          if (item) tempTeamGroup.push(item);
        });
        setGroup(tempGroup);
        setTeamGroup(tempTeamGroup);

        unrasterizeCanvas();
        deferRender.current = false;
        pathClones.current.forEach((c) => c.remove());
        pathClones.current = [];

        const timeBeforeUpdate = performance.now();
        scope.current.view.requestUpdate();
        requestAnimationFrame(() => {
          const timeAfterUpdate = performance.now();
          const updateDuration = timeAfterUpdate - timeBeforeUpdate;
          renderSlow.current = updateDuration > 20;
        });
      };

      // render immediately
      if (!deferRender.current) return void render();
      // defer render for 1000ms
      deferTimerID.current = window.setTimeout(render, 1000);
      // clean-up previous render timer.
      return () => window.clearTimeout(deferTimerID.current);
    }, [mergedStrokes, drawState]);

    const hitRef = useRef<paper.HitResult>();
    const [selected, setSelected] = useState(false);
    const paperMode = mode === "select" && selected ? "selected" : mode;
    const [chosenIDs, setChosenIDs] = useState<string[]>([]);
    const chosenItems = useMemo(() => {
      const IDSet = new Set(chosenIDs);
      return group.filter((item) => IDSet.has(item.name));
    }, [group, chosenIDs]);

    const resetSelect = useEvent(() => {
      setSelected(false);
      setPath(undefined);
      setRotateHandle(undefined);
      setChosenIDs([]);
      toggleSelectTool(false);
    });

    useEffect(() => {
      if (mode === "select") return resetSelect;
    }, [mode, resetSelect]);
    useEffect(() => resetSelect, [lasso, resetSelect]);

    // reset selection after redo/undo
    useEffect(() => {
      const type = drawState.lastOp?.type ?? "";
      if (/^redo|undo$/.test(type)) resetSelect();
    }, [drawState, resetSelect]);

    useEffect(() => {
      toggleSelectTool(false);
      if (pointText.current) {
        const ptProxy = new Proxy(pointText.current, {});
        toggleTextTool(ptProxy, renderSlow.current);
      }
    }, [canvasWidth, toggleSelectTool, toggleTextTool]);

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
        view.viewSize.multiply(devicePixelRatio)
      ));
      raster.drawImage(view.element, P_ZERO);
      raster.fitBounds(view.bounds);
      raster.visible = true;
      raster.opacity = process.env.NODE_ENV === "production" ? 1 : 0.5;
      const [, l1] = scope.current.project.layers;
      l1 && (l1.visible = false);
    };
    const unrasterizeCanvas = () => {
      scope.current.activate();
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
    const downLasso = (e: paper.MouseEvent) => {
      setPath(startStroke(drawCtrl, e.point));
      requestAnimationFrame(rasterizeCanvas);
    };
    const downRect = (e: paper.MouseEvent) => {
      // reset rect path before rasterizing;
      setPath(startRect(e.point));
      requestAnimationFrame(rasterizeCanvas);
    };

    const selectionDragged = useRef(false);
    const handleDown = {
      draw(e: paper.MouseEvent) {
        setDefer();
        downPath(e);
      },
      erase: downPath,
      select: lasso ? downLasso : downRect,
      selected(e: paper.MouseEvent) {
        selectionDragged.current = false;
        if (!path) return;
        if (!lasso) {
          // check if the point hit the segment point.
          let hitRes =
            path.hitTest(e.point, { segments: true }) ??
            rotateHandle?.hitTest(e.point, { segments: true, selected: true });
          hitRef.current = hitRes;
          if (hitRes) return;
        }

        // if click outside, reset the selection.
        if (!path.contains(e.point)) {
          resetSelect();
          setRotateHandle(undefined);
          lasso ? downLasso(e) : downRect(e);
        }
      },
      text: null,
    }[paperMode];

    const dragPath = (e: paper.MouseEvent) => {
      // cancel previous render timer.
      window.clearTimeout(deferTimerID.current);
      path?.add(e.point);
      path?.smooth();
    };
    const resizeRect = (e: paper.MouseEvent) => {
      if (!path) return;
      const { x, y } = e.point;
      const [, s1, s2, s3] = path.segments;
      if (!s1 || !s2 || !s3) return;
      s1.point.x = x;
      s2.point = e.point;
      s3.point.y = y;
      path.selected = true;
    };
    const moveSelected = (delta: paper.Point) => {
      chosenItems.forEach((item) => item.translate(delta));
      path?.translate(delta);
      rotateHandle?.translate(delta);
    };

    const handleDrag = {
      draw: dragPath,
      erase: dragPath,
      select: lasso ? dragPath : resizeRect,
      selected(e: paper.MouseEvent) {
        const hitRes = hitRef.current;
        if (!path) return;
        toggleSelectTool(false);
        selectionDragged.current = true;
        if (hitRes?.segment) {
          const segment = hitRes.segment;
          const rotating = segment.selected;
          if (rotating) {
            // rotate select items
            const { center } = path.bounds;
            const axis = segment.point.subtract(center);
            const line = e.point.subtract(center);
            setCursor(getRotateCurcor(line.angle));
            const angle = line.angle - axis.angle;
            path.rotate(angle, center);
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

            path.scale(scale, baseP);
            chosenItems.forEach((item) => {
              item.scale(scale, baseP);
              item.strokeWidth *= scale;
            });

            // reposition the rotate handle.
            if (!rotateHandle) return;
            rotateHandle.scale(scale, baseP);
            const rBaseP = rotateHandle.segments[0]?.point;
            if (!rBaseP) return;
            rotateHandle.scale(100 / rotateHandle.length, rBaseP);
          }
        } else {
          moveSelected(e.delta);
        }
      },
      text: null,
    }[paperMode];

    useEffect(() => {
      scope.current.tool.maxDistance = eraserWidth;
    }, [eraserWidth]);
    const erased = useRef(new Set<string>());
    const replaced = useRef(new Map<string, paper.Item>());

    const { globalEraser, pixelEraser } = drawCtrl;
    const itemGrid = useMemo(() => {
      if (!/^(erase|select)$/.test(mode)) return [];
      const items =
        globalEraser && mode === "erase" && !pixelEraser ? teamGroup : group;
      return gernerateGrid(items, width, height);
    }, [group, width, height, mode, teamGroup, globalEraser, pixelEraser]);

    const handleToolDrag = (e: paper.ToolEvent) => {
      const layer = scope.current.project.layers[1];
      if (paperMode !== "erase" || !layer) return;
      const ew = eraserWidth;

      const hitOption = { class: paper.Path, stroke: true, tolerance: ew / 2 };
      const bounds = new Rectangle(e.point.subtract(ew), new Size(ew, ew));

      getGridItems(itemGrid, bounds).forEach((item) => {
        if (erased.current.has(item.name)) return;
        if (!item.parent) return;
        item.hitTestAll(e.point, hitOption)?.forEach(({ item }) => {
          if (!(item instanceof paper.Path)) return;
          let topItem: paper.PathItem = item;
          while (topItem.parent !== layer) {
            if (!(topItem.parent instanceof paper.PathItem)) break;
            topItem = topItem.parent;
          }
          const { name } = topItem;

          if (pixelEraser) {
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
            paths.forEach((p) => (p.name = ""));
            return [uid, paths.map((p) => p.exportJSON())];
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
        if (!path) return;
        if (Math.abs(path.area) < 1_000) return setPath(undefined);

        let selection: string[];
        if (lasso) {
          path.closePath();
          path.simplify();
          if (!renderSlow.current) moveDash(path);
          const items = getGridItems(itemGrid, path.bounds);
          selection = checkLasso(items, path);
        } else {
          const items = getGridItems(itemGrid, path.bounds);
          selection = checkLasso(items, path);
          const link = new Path();
          const { topCenter } = path.bounds;
          link.add(topCenter, topCenter.subtract(new Point(0, 100)));
          link.lastSegment.selected = true;
          setRotateHandle(link);
        }
        setSelected(true);
        setChosenIDs(selection);
        showSelectTool();
      },
      selected(e: paper.MouseEvent) {
        handleSelectedCursor(e);
        if (!path || !selectionDragged.current) return;
        showSelectTool();
        updateMutation();
      },
      text(e: paper.MouseEvent) {
        if (pointText.current) {
          submitText();
          return handleTextCursor(e);
        }
        const [, l1] = scope.current.project.layers;
        if (!l1) return;

        const item = getClickedText(l1, e.point);
        const t = item && isSelfItem(item) ? item : startText(e.point);
        t.justification = "left";
        pointText.current = t;
        prevTextData.current = t.exportJSON();

        // hide pointText before rasterizing;
        if (renderSlow.current) t.visible = false;
        requestAnimationFrame(() => {
          rasterizeCanvas();
          t.visible = true;
        });

        toggleTextTool(t, renderSlow.current);
      },
    }[paperMode];

    const [cursor, setCursor] = useState("auto");
    const [currScale, setCurrScale] = useState(1);
    useEffect(() => {
      if (paperMode === "text" || paperMode === "select") {
        setCursor("crosshair");
      } else if (paperMode === "selected") {
        setCursor(lasso ? "crosshair" : "nwse-resize");
      } else if (paperMode === "draw" || paperMode === "erase") {
        setCursor(getCircleCursor(drawCtrl, ratio * currScale));
      }
    }, [paperMode, lasso, drawCtrl, ratio, currScale]);

    const handleSelectedCursor = (e: paper.MouseEvent) => {
      if (!path) return;
      const hitRes =
        path.hitTest(e.point, { segments: true }) ??
        rotateHandle?.hitTest(e.point, { segments: true, selected: true });
      if (hitRes?.segment) {
        if (hitRes.segment.selected) {
          const center = path.bounds.center;
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
      if (path.contains(e.point)) return setCursor("move");
      setCursor("crosshair");
    };

    const isSelfItem = (item: paper.Item) => {
      return drawState.getStrokeMap().has(item.name);
    };

    const handleTextCursor = (e: paper.MouseEvent) => {
      if (pointText.current) return setCursor("auto");
      const layer = scope.current.project.layers[1];
      if (!layer) return;
      const item = getClickedText(layer, e.point);
      if (item && isSelfItem(item)) setCursor("text");
      else setCursor("crosshair");
    };

    const handleMove = {
      selected: handleSelectedCursor,
      text: handleTextCursor,
      ...{ select: null, draw: null, erase: null },
    }[paperMode];

    const handleKeyDown = (e: paper.KeyEvent) => {
      if (paperMode !== "selected") return;
      const delta = {
        up: new Point(0, -10),
        down: new Point(0, 10),
        left: new Point(-10, 0),
        right: new Point(10, 0),
      }[e.key];
      if (!delta) return;
      e.preventDefault();
      delta && moveSelected(delta);
      toggleSelectTool(false);
    };

    const handleKeyUp = {
      selected(e: paper.KeyEvent) {
        if (/^(delete|backspace)$/.test(e.key)) deleteSelected();
        if (/^(up|down|left|right)$/.test(e.key)) updateMutation();
        if (/escape/.test(e.key)) resetSelect();
      },
      text(e: paper.KeyEvent) {
        if (/escape/.test(e.key)) submitText();
      },
      ...{ select: null, draw: null, erase: null },
    }[paperMode];

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
      tool.onKeyDown = activate(handleKeyDown);
      tool.onKeyUp = activate(handleKeyUp);
    });

    const updateMutation = () => {
      if (!chosenItems?.length) return;
      const mutations: Mutation[] = chosenItems.map((p) => {
        const { name } = p;
        p.name = "";
        return [name, p.exportJSON()];
      });
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
      if (!path || !chosenItems.length) return;
      const size = path.bounds.size;
      const { width, height } = size;
      const transP = new Point(width, height).divide(10);
      const copies = chosenItems.map((item) => item.clone());
      copies.forEach((item) => item.translate(transP));
      path.translate(transP);
      rotateHandle?.translate(transP);

      copies.forEach((p) => (p.name = ""));
      const pathDataList = copies.map((item) => item.exportJSON());
      const IDs: string[] = [];
      onChange((prev) => DrawState.addStrokes(prev, pathDataList, IDs));
      setChosenIDs(IDs);
      showSelectTool();
    };

    const rasterizeSelected = () => {
      scope.current.activate();
      const clip = path?.clone();
      clip && rasterizeLayer(clip, true);
      unrasterizeLayer();
      return layerRaster.current?.toDataURL() ?? "";
    };

    const pointText = useRef<paper.PointText>();
    const prevTextData = useRef("");
    const cancelText = useEvent(() => {
      unrasterizeCanvas();
      if (!pointText.current?.name) {
        pointText.current?.remove();
      }
      pointText.current = undefined;
      toggleTextTool(undefined, renderSlow.current);
    });

    const submitText = useEvent(() => {
      const t = pointText.current;
      if (!t) return;
      cancelText();
      if (t.exportJSON() === prevTextData.current) return;
      const { content, name } = t;
      t.name = "";
      // if text content empty
      if (!content) {
        // erase existing text item
        if (name) onChange((prev) => DrawState.eraseStrokes(prev, [name]));
        return;
      }
      const pathData = t.exportJSON();
      if (!name) {
        // add new text item
        onChange((prev) => DrawState.addStroke(prev, pathData));
      } else {
        // mutate existing text item
        onChange((prev) => DrawState.mutateStrokes(prev, [[name, pathData]]));
      }
    });
    const mutatePointText = (cb: (prev: paper.PointText) => void) => {
      const pt = pointText.current;
      if (!pt) return;
      scope.current.activate();
      cb(pt);
      toggleTextTool(new Proxy(pt, {}), renderSlow.current);
    };

    useEffect(() => {
      if (mode === "text") return submitText;
    }, [mode, submitText]);

    useImperativeHandle(ref, () => ({
      deleteSelected,
      duplicateSelected,
      rasterizeSelected,
      mutateStyle,
      mutatePointText,
    }));

    usePreventGesture();
    const prevScale = useRef(1);

    const beforeViewDragged = () => {
      toggleSelectTool(false);
      cancelText();
      rasterizeLayer(new Path.Rectangle(P_ZERO, projSize));
      unrasterizeCanvas();
    };
    usePinch(
      ({ memo, offset: [scale], first, last, origin }) => {
        scope.current.activate();
        const { view } = scope.current;
        const originRawP = new paper.Point(origin);

        let lastOrigin, elPos: paper.Point;
        if (first || !memo) {
          const { x, y } = view.element.getBoundingClientRect();
          elPos = new Point(x, y);
          lastOrigin = originRawP.subtract(elPos);
          beforeViewDragged();
        } else {
          [lastOrigin, elPos] = memo;
        }

        const originViewP = originRawP.subtract(elPos);
        const originPorjP = view.viewToProject(originViewP);

        const deltaP = originViewP.subtract(lastOrigin);
        const transP = deltaP.divide(view.zoom);
        view.translate(transP);

        let dScale = scale / prevScale.current;
        prevScale.current = scale;
        scope.current.settings.hitTolerance /= dScale;
        view.scale(dScale, originPorjP);

        if (last) {
          Promise.all([
            putCenterBack(view, projSize),
            scaleView(view, originPorjP, dScale),
          ]).then(unrasterizeLayer);
          view.scale(1 / dScale, originPorjP);
          setCurrScale(scale);
        } else {
          return [originViewP, elPos];
        }
      },
      {
        scaleBounds: { max: 5, min: 1 },
        rubberband: 0.5,
        target: canvasEl,
      }
    );

    useWheel(
      ({ event, delta, ctrlKey, first, last }) => {
        if (prevScale.current === 1 || ctrlKey) return;
        event.preventDefault();

        if (first) beforeViewDragged();

        const { view } = scope.current;
        const deltaP = new paper.Point(delta);
        const transP = P_ZERO.subtract(deltaP).divide(view.zoom);
        view.translate(transP);

        if (last) {
          putCenterBack(view, projSize);
          unrasterizeLayer();
        }
      },
      {
        target: canvasEl,
        eventOptions: { passive: false },
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
  useEffect(() => () => void item?.remove(), [item]);
  return tuple;
}

const paintStroke = (() => {
  const cacheMap = new WeakMap<
    paper.Layer,
    Map<string, { stroke: Stroke; item: paper.Item }>
  >();

  return (stroke: Stroke, layer: paper.Layer) => {
    const { pathData, uid } = stroke;
    let item: paper.Item;

    const cache = cacheMap.get(layer) ?? new Map();
    cacheMap.set(layer, cache);
    const cached = cache.get(uid);

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
    item.guide = false;
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
  const hitRes = layer.hitTest(point, { class: paper.PointText, fill: true });
  if (hitRes?.item instanceof paper.PointText) return hitRes?.item;
};

const startText = (point: paper.Point) => {
  return new paper.PointText({
    point: point.add(new Point(0, 50)),
    content: "",
    fontSize: 50,
    fontFamily: "Arial, sans-serif",
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
