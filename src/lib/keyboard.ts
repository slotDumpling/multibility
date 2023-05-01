import { useHotkeys } from "react-hotkeys-hook";

const isMac = /Mac/i.test(navigator.userAgent);

export function useRedoUndo(onUndo: () => void, onRedo: () => void) {
  const undoKey = isMac ? "meta+z" : "ctrl+z";
  const redoKey = isMac ? "meta+shift+z" : "ctrl+shift+z";

  useHotkeys(undoKey, (e) => {
    e.preventDefault();
    onUndo();
  });

  useHotkeys(redoKey, (e) => {
    e.preventDefault();
    onRedo();
  });
}
