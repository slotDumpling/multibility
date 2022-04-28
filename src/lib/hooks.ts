import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";

export function useObjectUrl(obj: Blob | MediaSource | undefined) {
  const url = useMemo(
    () => (obj ? URL.createObjectURL(obj) : undefined),
    [obj]
  );

  useEffect(() => {
    const prevUrl = url || "";
    return () => URL.revokeObjectURL(prevUrl);
  }, [url]);

  return url;
}

export function useMounted() {
  const _mounted = useRef(false);

  useEffect(() => {
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    };
  }, []);

  return _mounted;
}

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

export type Setter<T> = Dispatch<SetStateAction<T>>;
