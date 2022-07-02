import { useDebugValue, useEffect, useMemo, useRef, useState } from "react";
import localforage from "localforage";
import { Map } from "immutable";

export function useScrollPage(noteID: string, pageOrder = [] as string[]) {
  const [refMap, setRefMap] = useState(Map<string, HTMLElement>());
  const scrolled = useRef(false);
  const [prevPageID, setPrevPageID] = useState("");
  const [inviewRatios, setInviewRatios] = useState(Map<string, number>());
  const currPageID = useMemo(
    () => largestKey(inviewRatios, pageOrder),
    [inviewRatios, pageOrder]
  );
  useDebugValue(currPageID);

  useEffect(() => {
    const loadPrevPageID = async () => {
      const stored = await localforage.getItem<string>(`SCROLL_${noteID}`);
      if (!stored) return (scrolled.current = true);
      setPrevPageID(stored);
    };
    loadPrevPageID();
  }, [noteID]);

  useEffect(() => {
    if (scrolled.current || !refMap.has(prevPageID)) return;
    requestAnimationFrame(() => {
      refMap.get(prevPageID)?.scrollIntoView();
      scrolled.current = true;
    });
  }, [prevPageID, refMap]);

  useEffect(() => {
    if (!scrolled.current) return;
    localforage.setItem(`SCROLL_${noteID}`, currPageID);
  }, [currPageID, noteID]);

  const setRef = (pageID: string, el: HTMLElement | null) => {
    if (!el) return;
    setRefMap((prev) => prev.set(pageID, el));
  };

  const scrollPage = (pageID: string) => {
    refMap.get(pageID)?.scrollIntoView();
  };

  return { scrollPage, setInviewRatios, setRef, currPageID };
}

const largestKey = (map: Map<string, number>, order: string[]) => {
  let result = "";
  let maxRatio = 0;
  for (let key of order) {
    const ratio = map.get(key);
    if (!ratio) continue;
    if (ratio === 1) return key;
    if (ratio > maxRatio) {
      result = key;
      maxRatio = ratio;
    }
  }
  return result;
};