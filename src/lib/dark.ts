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
        ".note-item .draw-canvas",
        "[data-force-light=false] .color-select .circle",
        "[data-force-light=false] .width-circle.lineWidth",
        "[data-force-light=false] .font-icon",
        ".note-item .timg",
      ],
      css: "",
      ignoreImageAnalysis: [],
      disableStyleSheetsProxy: false,
    }
  );
};
