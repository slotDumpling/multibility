import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useDebugValue,
  useLayoutEffect,
  useDeferredValue,
} from "react";
import localforage from "localforage";
import { Map } from "immutable";
import { debounce } from "lodash";
import { useMemoizedFn as useEvent } from "ahooks";

const scrollForage = localforage.createInstance({ name: "scroll" });
const persistScroll = debounce((noteID: string, currPageID: string) => {
  scrollForage.setItem(noteID, currPageID);
}, 2000);

export function useScrollPage(
  noteID: string,
  pageOrder = [] as string[],
  deps = [] as any[]
) {
  const [refMap, setRefMap] = useState(Map<string, HTMLElement>());
  const scrolled = useRef(false);
  const [prevPageID, setPrevPageID] = useState("");
  useEffect(() => {
    (async () => {
      const stored = await scrollForage.getItem<string>(noteID);
      if (!stored) return (scrolled.current = true);
      setPrevPageID(stored);
    })();
  }, [noteID]);

  useLayoutEffect(() => {
    const section = refMap.get(prevPageID);
    if (scrolled.current || !section) return;
    section.scrollIntoView();
    scrolled.current = true;
  }, [prevPageID, refMap]);

  const [inviewRatios, setInviewRatios] = useState(Map<string, number>());
  const deferredRatios = useDeferredValue(inviewRatios);
  const deferredOrder = useDeferredValue(pageOrder);
  const currPageID = useMemo(
    () => largestKey(deferredRatios, deferredOrder),
    [deferredRatios, deferredOrder]
  );

  useEffect(() => {
    if (scrolled.current) persistScroll(noteID, currPageID);
  }, [noteID, currPageID]);

  const calcScrollY = useEvent(() => {
    const section = refMap.get(currPageID);
    const header = section?.parentElement?.parentElement?.firstElementChild;
    if (!header) return 0;
    const { top } = section.getBoundingClientRect();
    const { height } = header.getBoundingClientRect();
    return -top + height;
  });
  const scrollY = useMemo(calcScrollY, [pageOrder, calcScrollY, ...deps]);

  const scrollToCurr = useEvent(() => {
    console.log({ scrollY });
    const section = refMap.get(currPageID);
    if (!section) return;
    section.scrollIntoView();
    window.scrollBy(0, scrollY);
  });
  useLayoutEffect(scrollToCurr, [pageOrder, scrollToCurr, ...deps]);

  const sectionRef = useEvent((pageID: string) => (el: HTMLElement | null) => {
    if (!el) return;
    setRefMap((prev) => prev.set(pageID, el));
  });

  const taskID = useRef(0);
  const [scrolling, setScrolling] = useState(false);
  const scrollPage = (pageID: string) => {
    const section = refMap.get(pageID);
    if (!section) return;
    const handleScroll = () => {
      window.clearTimeout(taskID.current);
      taskID.current = window.setTimeout(() => {
        setScrolling(false);
        document.removeEventListener("scroll", handleScroll);
      }, 50);
    };
    document.addEventListener("scroll", handleScroll);
    section.scrollIntoView({ behavior: "smooth" });
    setScrolling(true);
  };

  useDebugValue(currPageID);
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
