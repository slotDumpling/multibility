import { Dispatch, SetStateAction, useRef, useState } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export function useEventWaiter(): [Promise<void>, () => void] {
  const resRef = useRef(() => {});
  const resolve = () => resRef.current();

  const [promise] = useState(
    () => new Promise<void>((res) => (resRef.current = res))
  );

  return [promise, resolve];
}
