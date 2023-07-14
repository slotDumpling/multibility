import { PointerEvent, TouchEvent, useEffect, useRef } from "react";

type iOSTouch = Touch & {
  force?: number;
  touchType?: "stylus" | "direct";
};

export function isApplePencil(e: TouchEvent) {
  const touch = e.touches[0] as iOSTouch;
  return touch?.touchType === "stylus";
}

export function usePreventTouch(
  allowFinger: boolean
): React.HTMLAttributes<HTMLDivElement> {
  const isTouch = useRef(false);
  const checkPoniter = (e: PointerEvent) =>
    e.isPrimary && (isTouch.current = e.pointerType === "touch");

  const isEventValid = (e: TouchEvent) =>
    !isTouch.current ||
    isApplePencil(e) ||
    (allowFinger && e.touches.length === 1);

  const preventTouch = (e: TouchEvent) =>
    isEventValid(e) || e.stopPropagation();

  return {
    onPointerDownCapture: checkPoniter,
    onPointerMoveCapture: checkPoniter,
    onTouchStartCapture: preventTouch,
    onTouchMoveCapture: preventTouch,
  };
}

export const rightClickHandler: React.HTMLAttributes<HTMLDivElement> = {
  onMouseDownCapture: (e) => {
    if (e.button !== 0) e.stopPropagation();
  },
  onContextMenu: (e) => e.preventDefault(),
};

export function usePreventGesture() {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);
}
