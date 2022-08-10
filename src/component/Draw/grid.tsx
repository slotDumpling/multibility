export const gernerateGrid = (
  group: paper.Item[],
  width: number,
  height: number
) => {
  const wnum = Math.ceil(width / 100);
  const hnum = Math.ceil(height / 100);
  const grid = Array.from({ length: wnum }, () =>
    Array.from({ length: hnum }, () => new Set<paper.Item>())
  );
  group.forEach((item) => setGridItem(grid, item));
  return grid;
};

const getGridRange = (bounds: paper.Rectangle) => {
  const { topLeft, bottomRight } = bounds;
  return [
    Math.floor(topLeft.x / 100),
    Math.ceil(bottomRight.x / 100),
    Math.floor(topLeft.y / 100),
    Math.ceil(bottomRight.y / 100),
  ] as [number, number, number, number];
};
export const setGridItem = (
  grid: Set<paper.Item>[][],
  item: paper.Item,
  replaced?: paper.Item
) => {
  const bounds = (replaced ?? item).strokeBounds;
  const [xmin, xmax, ymin, ymax] = getGridRange(bounds);
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      replaced && grid[x]?.[y]?.delete(replaced);
      grid[x]?.[y]?.add(item);
    }
  }
};
export const getGridItems = (
  grid: Set<paper.Item>[][],
  bounds: paper.Rectangle
) => {
  const itemSet = new Set<paper.Item>();
  const [xmin, xmax, ymin, ymax] = getGridRange(bounds);
  for (let x = xmin; x <= xmax; x += 1) {
    for (let y = ymin; y <= ymax; y += 1) {
      grid[x]?.[y]?.forEach((item) => itemSet.add(item));
    }
  }
  return Array.from(itemSet);
};
