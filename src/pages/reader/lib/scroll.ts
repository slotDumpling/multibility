import { useDebugValue, useEffect, useMemo, useRef, useState } from "react";
import localforage from "localforage";
import { Map } from "immutable";
import { debounce } from "lodash";

const scrollForage = localforage.createInstance({ name: "scroll" });
const persistScroll = debounce((noteID: string, currPageID: string) => {
  scrollForage.setItem(noteID, currPageID);
}, 5000);

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
    persistScroll(noteID, currPageID);
  }, [noteID, currPageID]);

  const sectionRef = (pageID: string) => (el: HTMLElement | null) => {
    if (!el) return;
    setRefMap((prev) => prev.set(pageID, el));
  };

  const taskID = useRef(0);
  const [scrolling, setScrolling] = useState(false);
  const scrollPage = (pageID: string) => {
    const handleScroll = () => {
      cancelAnimationFrame(taskID.current);
      requestAnimationFrame(() => {
        taskID.current = requestAnimationFrame(() => {
          setScrolling(false);
          document.removeEventListener("scroll", handleScroll);
        });
      });
    };
    setScrolling(true);
    document.addEventListener("scroll", handleScroll);
    refMap.get(pageID)?.scrollIntoView({ behavior: "smooth" });
  };

  return { scrollPage, setInviewRatios, sectionRef, currPageID, scrolling };
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
