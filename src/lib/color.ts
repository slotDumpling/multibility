import { CSSProperties } from "react";
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

const colorPalette: Record<string, { light: string; dark: string }> = {
  "#f97316": { light: "#FFEDD5", dark: "#9A3412" },
  "#eab308": { light: "#FEF9C3", dark: "#854D0E" },
  "#84cc16": { light: "#ECFCCB", dark: "#3F6212" },
  "#22c55e": { light: "#DCFCE7", dark: "#166534" },
  "#10b981": { light: "#D1FAE5", dark: "#065F46" },
  "#14b8a6": { light: "#CCFBF1", dark: "#115E59" },
  "#06b6d4": { light: "#CFFAFE", dark: "#155E75" },
  "#0ea5e9": { light: "#E0F2FE", dark: "#075985" },
  "#3b82f6": { light: "#DBEAFE", dark: "#1E40AF" },
  "#6366f1": { light: "#E0E7FF", dark: "#3730A3" },
  "#8b5cf6": { light: "#EDE9FE", dark: "#5B21B6" },
  "#a855f7": { light: "#F3E8FF", dark: "#6B21A8" },
  "#d946ef": { light: "#FAE8FF", dark: "#86198F" },
  "#ec4899": { light: "#FCE7F3", dark: "#9D174D" },
  "#f43f5e": { light: "#FFE4E6", dark: "#9F1239" },
  "#ef4444": { light: "#FEE2E2", dark: "#991B1B" },
};

export const getColorPalette = (color: string) => {
  const palette = colorPalette[color] ?? { light: "#E5E7EB", dark: "#374151" };
  return {
    "--light-color": palette.light,
    "--dark-color": palette.dark,
  } as CSSProperties;
};
