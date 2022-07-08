import { createContext, FC, useContext, useDebugValue, useState } from "react";
import { Setter } from "./hooks";

export const loadDarkMode = async () => {
  const { auto: setAutoDarkMode } = await import("darkreader");
  setAutoDarkMode(
    { brightness: 100, contrast: 100 },
    {
      ignoreInlineStyle: [
        ".color-select .circle",
        ".color-circle",
        ".font-icon",
      ],
      invert: [
        "[data-force-light=false] .draw-canvas",
        ".color-select[data-force-light=false]  .circle",
        "[data-force-light=false] .width-circle.lineWidth",
        "[data-force-light=false] .font-icon",
      ],
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

export const DarkModeProvider: FC = ({ children }) => {
  const tuple = useState(false);
  return <DarkCtx.Provider value={tuple}>{children}</DarkCtx.Provider>;
};
