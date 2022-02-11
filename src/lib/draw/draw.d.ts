export interface Point {
  x: number;
  y: number;
  lineWidth: number;
}

export type iOSTouch = Touch & {
  force?: number;
  touchType: "stylue" | "direct";
};
