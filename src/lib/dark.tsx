import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useDebugValue,
  useState,
} from "react";

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

const DarkModeContext = React.createContext({
  forceLight: false,
  setForceLight: (() => {}) as Dispatch<SetStateAction<boolean>>,
});
export function useForceLight() {
  const { forceLight, setForceLight } = useContext(DarkModeContext);
  useDebugValue(forceLight);
  return [forceLight, setForceLight] as [
    typeof forceLight,
    typeof setForceLight
  ];
}
export const DarkModeProvider: FC = ({ children }) => {
  const [forceLight, setForceLight] = useState(false);
  return (
    <DarkModeContext.Provider value={{ forceLight, setForceLight }}>
      {children}
    </DarkModeContext.Provider>
  );
};
