import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useDebugValue,
  useRef,
  useState,
} from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export function useEventWaiter(): [Promise<void>, () => void] {
  const resRef = useRef(() => {});
  const resolve = () => resRef.current();

  const [promise] = useState(
    () => new Promise<void>((res) => (resRef.current = res))
  );

  return [promise, resolve];
}

const ActiveKeyCtx = createContext<[string, Setter<string>]>(["", () => {}]);
export function useActiveKey() {
  const tuple = useContext(ActiveKeyCtx);
  useDebugValue(tuple[0]);
  return tuple;
}

export const ActiveKeyProvider: FC<{ initKey: string }> = ({
  children,
  initKey,
}) => {
  const tuple = useState(initKey);
  return (
    <ActiveKeyCtx.Provider value={tuple}>{children}</ActiveKeyCtx.Provider>
  );
};
