import React, { FC, useState } from "react";
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
        "[data-force-light=false] .color-select .circle",
        "[data-force-light=false] .width-circle.lineWidth",
        "[data-force-light=false] .font-icon",
      ],
      css: "",
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
};

export const DarkModeContext = React.createContext({
  forceLight: false,
  setForceLight: (() => {}) as Setter<boolean>,
});
export const DarkModeProvider: FC = ({ children }) => {
  const [forceLight, setForceLight] = useState(false);
  return (
    <DarkModeContext.Provider value={{ forceLight, setForceLight }}>
      {children}
    </DarkModeContext.Provider>
  );
};
