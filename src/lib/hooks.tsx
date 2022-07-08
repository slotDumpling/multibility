import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  TransitionEventHandler,
  useContext,
  useDebugValue,
  useRef,
  useState,
} from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export function useTransitionEnd({
  propertyName,
  active = true,
}: {
  propertyName: string;
  active?: boolean;
}): [Promise<void>, TransitionEventHandler] {
  const resRef = useRef(() => {});
  const [promise] = useState(
    () => new Promise<void>((res) => (resRef.current = res))
  );
  return [
    promise,
    (e) => {
      if (e.propertyName === propertyName && active) resRef.current();
    },
  ];
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
