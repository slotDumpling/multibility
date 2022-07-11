import { useDebugValue, useEffect, useMemo, useRef, useState } from "react";
import localforage from "localforage";
import { Map } from "immutable";

const scrollForage = localforage.createInstance({ name: "scroll" });

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
    (async () => {
      const stored = await scrollForage.getItem<string>(noteID);
      if (!stored) return (scrolled.current = true);
      setPrevPageID(stored);
    })();
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
    scrollForage.setItem(noteID, currPageID);
  }, [noteID, currPageID]);

  const sectionRef = (pageID: string) => (el: HTMLElement | null) => {
    if (!el) return;
    setRefMap((prev) => prev.set(pageID, el));
  };

  const scrollPage = (pageID: string) => {
    refMap.get(pageID)?.scrollIntoView();
  };

  return { scrollPage, setInviewRatios, sectionRef, currPageID };
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
