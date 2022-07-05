import hash from "string-hash";
export const colors = [
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
];

export const grayColors = ["#000000", "#9ca3af", "#64748b", "#78716c"];
export const allColors = [...grayColors, ...colors];

export const getRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

export const getHashedColor = (str: string) => {
  const index = hash(str) % colors.length;
  return colors[index];
};
