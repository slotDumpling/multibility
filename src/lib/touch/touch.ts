import { TouchEvent } from "react";

export type iOSTouch = Touch & {
  force?: number;
  touchType?: "stylus" | "direct";
};

export function isStylus(e: TouchEvent<HTMLCanvasElement> | globalThis.TouchEvent) {
  const touch = e.touches[0] as iOSTouch;
  return touch?.touchType === "stylus";
}
