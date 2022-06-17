import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export function useEventWaiter(): [() => Promise<void>, () => void] {
  const resolerRef = useRef(() => {});
  const resolver = () => resolerRef.current();

  const promise = useRef(Promise.resolve());
  useEffect(() => {
    promise.current = new Promise((res) => (resolerRef.current = res));
  }, []);
  const promiser = () => promise.current;

  return [promiser, resolver];
}
