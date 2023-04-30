export function createVirtualCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("can't get virtual canvas context");
  }
  canvas.width = width;
  canvas.height = height;
  return { canvas, context };
}

export function releaseCanvas(canvas?: HTMLCanvasElement) {
  if (!canvas) return;
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, 1, 1);
}
