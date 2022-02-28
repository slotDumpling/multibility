import { TouchEvent } from "react";

export type iOSTouch = Touch & {
  force?: number;
  touchType: "stylue" | "direct";
};

export function isFinger(e: TouchEvent<HTMLCanvasElement> | globalThis.TouchEvent) {
  const touch = e.touches[0] as iOSTouch;
  return touch.touchType === "direct";
}
