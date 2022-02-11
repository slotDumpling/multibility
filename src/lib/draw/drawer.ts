import { Point } from "./draw";

export class Drawer {
  public points: Point[] = [];

  constructor(
    private context: CanvasRenderingContext2D,
    private width: number,
    private height: number
  ) {}

  drawBegin(point: Point) {
    this.points.push(point);
    const { x, y, lineWidth } = point;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.stroke();
  }

  drawCurve(toP: Point, color = "black") {
    const fromP = this.points.slice(-1)[0];
    this.points.push(toP);
    if (this.points.length < 3) return;

    const xc = (toP.x + fromP.x) / 2;
    const yc = (toP.y + fromP.y) / 2;
    this.context.strokeStyle = color;
    this.context.lineCap = "round";
    this.context.lineJoin = "round";
    this.context.lineWidth = fromP.lineWidth;
    this.context.quadraticCurveTo(fromP.x, fromP.y, xc, yc);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(xc, yc);
  }

  getImageData(): ImageData {
    return this.context.getImageData(0, 0, this.width, this.height);
  }

  static createRaw(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw Error("can't get canvas context");
    }
    return new Drawer(context, width, height);
  }
}

const MIRROR_SIZE = 100;

export class DualDrawer {
  public points: Point[] = [];
  private mainDrawer: Drawer;
  private mirrorDrawer: Drawer;
  private ratio: number;

  constructor(
    private context: CanvasRenderingContext2D,
    private width: number,
    private height: number
  ) {
    this.mainDrawer = new Drawer(context, width, height);

    if (width <= MIRROR_SIZE && height <= MIRROR_SIZE) {
      this.ratio = 1;
      this.mirrorDrawer = Drawer.createRaw(width, height);
    } else if (width > height) {
      this.ratio = width / MIRROR_SIZE;
      this.mirrorDrawer = Drawer.createRaw(
        MIRROR_SIZE,
        height / this.ratio
      );
    } else {
      this.ratio = height / MIRROR_SIZE;
      this.mirrorDrawer = Drawer.createRaw(
        width / this.ratio,
        MIRROR_SIZE
      );
    }
  }

  drawBegin(point: Point) {
    this.points.push(point);
    this.mainDrawer.drawBegin(point);
    this.mirrorDrawer.drawBegin(this.computeMirrorPoint(point));
  }

  drawCurve(toP: Point, color = "black") {
    this.points.push(toP);
    this.mainDrawer.drawCurve(toP, color);
    this.mirrorDrawer.drawCurve(this.computeMirrorPoint(toP), 'black');
  }

  computeLineWidth(pressure: number) {
    return (
      Math.log(pressure + 1) * 5 +
      (this.points.slice(-1)[0]?.lineWidth ?? 0) * 0.8
    );
  }

  getMirrorImageData(): ImageData {
    return this.mirrorDrawer.getImageData();
  }

  private computeMirrorPoint(point: Point) {
    return {
      x: point.x / this.ratio,
      y: point.y / this.ratio,
      lineWidth: point.lineWidth / this.ratio,
    };
  }
}

export function drawPoints(
  context: CanvasRenderingContext2D,
  points: Point[],
  color = "black",
  width: number,
  height: number
) {
  const drawer = new Drawer(context, width, height);
  const clonedPs = points.slice();
  const firstP = clonedPs.shift();
  if (!firstP) return;
  drawer.drawBegin(firstP);
  clonedPs.forEach((p) => void drawer.drawCurve(p, color));
}
