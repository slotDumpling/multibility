export const loadDarkMode = async () => {
  const { auto: setAutoDarkMode } = await import("darkreader");
  setAutoDarkMode(
    { brightness: 100, contrast: 100 },
    {
      ignoreInlineStyle: [".color-select .circle", ".color-circle"],
      invert: [
        "[data-dark=true] .draw-canvas",
        "[data-dark=true] .color-select .circle",
        "[data-dark=true] .width-circle",
        "[data-dark=true] .width-circle",
      ],
      css: "",
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
};
