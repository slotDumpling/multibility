import { FC, useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useDrawCtrl } from "lib/draw/DrawCtrl";
import { useForceLight } from "lib/Dark";
import { useMemoizedFn as useEvent } from "ahooks";
import { Draw, ActiveToolKey, DrawRefType } from "component/draw";
import { SelectTool, TextTool } from "pages/reader/tools/DrawTools";
import { once, range } from "lodash-es";
import { useInView } from "react-intersection-observer";
import { DrawState } from "lib/draw/DrawState";
import { Map, Set } from "immutable";
import "./page-wrapper.sass";

export const PageWrapper: FC<{
  drawState: DrawState;
  teamStateMap?: Map<string, DrawState>;
  thumbnail?: string;
  pdfIndex?: number;
  noteID?: string;
  updateState?: (ds: DrawState) => void;
  onViewChange?: (visible: boolean, ratio: number) => void;
  preview?: boolean;
  preload?: boolean;
  ignores?: Set<string>;
}> = ({
  thumbnail,
  drawState,
  teamStateMap,
  updateState,
  pdfIndex,
  noteID = "",
  preview = false,
  onViewChange = () => {},
  preload = false,
  ignores = Set(),
}) => {
  const [ref, visible, entry] = useInView({ threshold: range(0, 1.1, 0.1) });
  useEffect(() => {
    if (!entry || !visible) return onViewChange(false, 0);
    onViewChange(true, entry.intersectionRatio);
  }, [visible, entry, onViewChange]);

  const [fullImg, setFullImg] = useState<string>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadImage = useCallback(
    once(async () => {
      if (!pdfIndex || !noteID) return;
      const { getNotePageImage } = await import("lib/note/pdfImage");
      setFullImg(await getNotePageImage(noteID, pdfIndex));
    }),
    [pdfIndex, noteID]
  );

  const show = visible || preload;
  useEffect(() => {
    if (!preview && show) loadImage();
  }, [show, preview, loadImage]);

  const otherStates = useMemo(
    () => teamStateMap?.deleteAll(ignores).toList().toArray(),
    [teamStateMap, ignores]
  );

  const imageLoaded = Boolean(fullImg || !pdfIndex);
  const drawShow = show && imageLoaded;

  const { height, width } = drawState;
  const ratio = height / width;
  const [forceLight] = useForceLight();

  return (
    <div ref={ref} className="page-wrapper" data-force-light={forceLight}>
      <svg viewBox={`0 0 100 ${ratio * 100}`} />
      {drawShow && (
        <DrawWrapper
          drawState={drawState}
          otherStates={otherStates}
          updateState={updateState}
          imgSrc={fullImg || thumbnail}
          preview={preview}
        />
      )}
    </div>
  );
};
const DrawWrapper: FC<{
  drawState: DrawState;
  otherStates?: DrawState[];
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
  imgSrc?: string;
}> = ({ drawState, updateState, otherStates, preview = false, imgSrc }) => {
  const drawCtrl = useDrawCtrl();
  const [activeTool, setActiveTool] = useState<ActiveToolKey>("");
  const drawRef = useRef<DrawRefType>(null);

  const handleChange = useEvent(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      const newDS = arg instanceof DrawState ? arg : arg(drawState);
      if (newDS === drawState) return;
      updateState(newDS);
    }
  );

  return preview ? (
    <Draw
      drawState={drawState}
      otherStates={otherStates}
      imgSrc={imgSrc}
      readonly
    />
  ) : (
    <>
      <Draw
        drawState={drawState}
        otherStates={otherStates}
        onChange={handleChange}
        imgSrc={imgSrc}
        drawCtrl={drawCtrl}
        ref={drawRef}
        setActiveTool={setActiveTool}
      />
      <SelectTool drawRef={drawRef} visible={activeTool === "select"} />
      <TextTool drawRef={drawRef} visible={activeTool === "text"} />
    </>
  );
};
DrawWrapper.displayName = "DrawWrapper";
