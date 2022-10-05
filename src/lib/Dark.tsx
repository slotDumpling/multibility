import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useDebugValue,
  useEffect,
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
        ".pen-icon path",
        ".text-color-icon",
      ],
      invert: [
        ".draw-canvas",
        "label .circle",
        ".width-circle.lineWidth",
        ".pen-icon",
        ".text-color-icon",
      ].map((selector) => `body:not([data-force-light=true]) ${selector}`),
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
  const [forceLight] = tuple;
  useEffect(() => {
    document.body.dataset.forceLight = String(forceLight);
    return () => {
      delete document.body.dataset.forceLight;
    };
  }, [forceLight]);
  return <DarkCtx.Provider value={tuple}>{children}</DarkCtx.Provider>;
};
