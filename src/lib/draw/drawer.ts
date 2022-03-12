// export class Drawer {
//   constructor(
//     private context: CanvasRenderingContext2D,
//     public points: Point[] = [],
//   ) {}

//   drawBegin(point: Point) {
//     this.points.push(point);
//     const { x, y, lineWidth } = point;
//     this.context.lineWidth = lineWidth;
//     this.context.beginPath();
//     this.context.moveTo(x, y);
//   }

//   drawCurve(toP: Point, color = "#000000") {
//     const fromP = this.points.slice(-1)[0];
//     this.points.push(toP);
//     if (this.points.length < 3) return;

//     const xc = (toP.x + fromP.x) / 2;
//     const yc = (toP.y + fromP.y) / 2;
//     this.context.strokeStyle = color;
//     this.context.lineCap = "round";
//     this.context.lineJoin = "round";
//     this.context.lineWidth = fromP.lineWidth;
//     this.context.quadraticCurveTo(fromP.x, fromP.y, xc, yc);
//     this.context.stroke();
//     this.context.beginPath();
//     this.context.moveTo(xc, yc);
//   }

//   drawCurveComplete(color = 'black') {
//     if (this.points.length < 3) return;
//     this.context.lineWidth = Math.max(...this.points.map(p => p.lineWidth));
//     let fromP = this.points[0];
//     this.context.beginPath();
//     this.context.strokeStyle = color;
//     this.context.lineCap = "round";
//     this.context.lineJoin = "round";
//     this.context.moveTo(fromP.x, fromP.y);
//     for (let i = 1; i < this.points.length; i += 1) {
//       const xc = (this.points[i].x + fromP.x) / 2;
//       const yc = (this.points[i].y + fromP.y) / 2;
//       this.context.quadraticCurveTo(fromP.x, fromP.y, xc, yc);
//       fromP = this.points[i];
//     }
//     this.context.stroke();
//   }

//   computeLineWidth(pressure: number) {
//     return (
//       Math.log(pressure + 1) * 5 +
//       (this.points.slice(-1)[0]?.lineWidth ?? 0) * 0.8
//     );
//   }

//   static createRaw(width: number, height: number) {
//     const canvas = document.createElement("canvas");
//     canvas.width = width;
//     canvas.height = height;
//     const context = canvas.getContext("2d");
//     if (!context) {
//       throw Error("can't get canvas context");
//     }
//     return new Drawer(context);
//   }
// }

// export function drawPoints(
//   context: CanvasRenderingContext2D,
//   points: Point[],
//   color = "black",
// ) {
//   const drawer = new Drawer(context, points);
//   drawer.drawCurveComplete(color);
//   // const clonedPs = points.slice();
//   // const firstP = clonedPs.shift();
//   // if (!firstP) return;
//   // drawer.drawBegin(firstP);
//   // clonedPs.forEach((p) => drawer.drawCurve(p, color));
// }

export function createVirtualCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("can't get virtual canvas context");
  }
  canvas.width = width;
  canvas.height = height;
  return { canvas, context };
}
