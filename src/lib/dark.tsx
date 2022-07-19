import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useDebugValue,
  useState,
} from "react";
import { Setter } from "./hooks";

export const loadDarkMode = async () => {
  const { auto: setAutoDarkMode } = await import("darkreader");
  setAutoDarkMode(
    { brightness: 100, contrast: 100 },
    {
      ignoreInlineStyle: [
        "label .circle",
        ".color-circle",
        ".font-icon",
        ".pen-icon path",
      ],
      invert: [
        ".draw-canvas",
        "label .circle",
        ".width-circle.lineWidth",
        ".font-icon",
        ".pen-icon",
      ].map((selector) => `[data-force-light=false] ${selector}`),
      css: "",
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
};

const DarkCtx = createContext<[boolean, Setter<boolean>]>([false, () => {}]);
export function useForceLight() {
  const tuple = useContext(DarkCtx);
  useDebugValue(tuple[0]);
  return tuple;
}

export const DarkModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const tuple = useState(false);
  return <DarkCtx.Provider value={tuple}>{children}</DarkCtx.Provider>;
};
