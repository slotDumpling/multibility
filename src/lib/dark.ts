export const loadDarkMode = async () => {
  const { auto: setAutoDarkMode } = await import("darkreader");
  setAutoDarkMode(
    { brightness: 100, contrast: 100 },
    {
      ignoreInlineStyle: [".color-select .circle", ".color-circle"],
      invert: [
        "[data-force-light=false] .draw-canvas",
        "[data-force-light=false] .color-select .circle",
        "[data-force-light=false] .width-circle.lineWidth",
        ".note-item .timg",
      ],
      css: "",
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
};
