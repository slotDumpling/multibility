import { createVirtualCanvas, drawPoints } from "./drawer";
import { DrawState } from "./DrawState";

export type CtxRecord = Record<string, CanvasRenderingContext2D>;

export class Eraser {
  public ctxRec: CtxRecord = {};
  private prevPoint?: [number, number];
  constructor(
    drawState: DrawState,
    cache: CtxRecord = {}
  ) {
    const strokes = drawState.getValidStrokes();
    const { width, height } = drawState;
    strokes.forEach(({ points, uid }) => {
      if (uid in cache) {
        this.ctxRec[uid] = cache[uid];
        return;
      }
      const { context } = createVirtualCanvas(width, height);
      this.ctxRec[uid] = context;
      drawPoints(context, points, "black");
    });
  }

  checkPoint([x, y]: [number, number]) {
    return Object.entries(this.ctxRec)
      .filter(([, ctx]) => ctx.isPointInStroke(x, y))
      .map(([uid]) => uid);
  }

  checkWithIntrpl([x, y]: [number, number]) {
    const checkPoints: [number, number][] = this.prevPoint
      ? computeIntrplPoints(this.prevPoint, [x, y])
      : [[x, y]];
    this.prevPoint = [x, y];
    return checkPoints
      .map((p) => this.checkPoint(p))
      .reduce((prev, curr) => {
        curr.forEach((uid) => prev.add(uid));
        return prev;
      }, new Set<string>());
  }
}

function computeIntrplPoints(
  [prevX, prevY]: [number, number],
  [currX, currY]: [number, number]
): [number, number][] {
  const [dx, dy] = [currX - prevX, currY - prevY];
  const g = Math.max(Math.abs(dx), Math.abs(dy));
  if (g === 0) return [[currX, currY]];

  const [gx, gy] = [dx / g, dy / g];
  const points: [number, number][] = [];
  while (
    ((dx <= 0 && prevX >= currX) || (dx > 0 && prevX <= currX)) &&
    ((dy <= 0 && prevY >= currY) || (dy > 0 && prevY <= currY))
  ) {
    prevX += gx;
    prevY += gy;
    points.push([prevX, prevY]);
  }
  return points;
}
