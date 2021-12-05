import { Point } from "./draw";

export class Drawer {
  public points: Point[] = [];

  constructor(private context: CanvasRenderingContext2D) {}
  drawBegin(point: Point) {
    this.points.push(point);
    this.context.lineWidth = point.lineWidth;
    // content.strokeStyle = point.color;
    this.context.beginPath();
    this.context.moveTo(point.x, point.y);
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
  computeLineWidth(pressure: number) {
    return (
      Math.log(pressure + 1) * 5 +
      (this.points.slice(-1)[0]?.lineWidth || 0) * 0.8
    );
  }
}

export function drawPoints(context: CanvasRenderingContext2D, points: Point[], color = 'black') {
  const drawer = new Drawer(context);
  const clonedPs = points.slice();
  const firstP = clonedPs.shift();
  if (!firstP) return;
  drawer.drawBegin(firstP);
  clonedPs.forEach((p) => void drawer.drawCurve(p, color));
}
