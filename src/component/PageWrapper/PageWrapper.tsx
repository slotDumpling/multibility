import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDrawCtrl } from "lib/draw/DrawCtrl";
import { useMemoizedFn as useEvent } from "ahooks";
import { Draw, DrawRefType } from "component/Draw";
import { SelectTool, TextTool } from "pages/reader/tools/DrawTools";
import { once, range } from "lodash";
import { useInView } from "react-intersection-observer";
import { DrawState } from "lib/draw/DrawState";
import { Map, Set } from "immutable";
import { P_ZERO } from "component/Draw/Draw";

const PageWrapperRaw: FC<{
  drawState: DrawState;
  teamStateMap?: Map<string, DrawState>;
  thumbnail?: string;
  pdfIndex?: number;
  noteID?: string;
  updateState?: (ds: DrawState) => void;
  onViewChange?: (ratio: number) => void;
  preview?: boolean;
  preload?: boolean;
  ignores?: Set<string>;
  skipInView?: boolean;
}> = ({
  thumbnail,
  drawState,
  teamStateMap,
  updateState,
  pdfIndex,
  noteID = "",
  preview = false,
  onViewChange,
  preload = false,
  ignores = Set<string>(),
  skipInView = false,
}) => {
  const threshold = onViewChange && range(0, 1.2, 0.2);
  const [ref, visible, entry] = useInView({ threshold, skip: skipInView });
  useEffect(() => {
    if (!onViewChange) return;
    if (!entry || !visible) return onViewChange(0);
    onViewChange(entry.intersectionRatio);
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

  return (
    <div ref={ref} className="page-wrapper">
      <svg className="size-holder" viewBox={`0 0 100 ${ratio * 100}`} />
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
PageWrapperRaw.displayName = "PageWrapper";
export const PageWrapper = React.memo(PageWrapperRaw);

const DrawWrapper: FC<{
  drawState: DrawState;
  otherStates?: DrawState[];
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
  imgSrc?: string;
}> = ({ drawState, updateState, otherStates, preview = false, imgSrc }) => {
  const drawCtrl = useDrawCtrl();
  const drawRef = useRef<DrawRefType>(null);
  const [textShow, setTextShow] = useState(false);
  const [selectShow, setSelectShow] = useState(false);
  const [pointText, setPointText] = useState<paper.PointText>();
  const [clickPoint, setClickPoint] = useState<paper.Point>(P_ZERO);

  const handleChange = useEvent(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      const newDS = arg instanceof DrawState ? arg : arg(drawState);
      if (newDS === drawState) return;
      updateState(newDS);
    }
  );

  const toggleSelectTool = useEvent(
    (active: boolean, clickPoint?: paper.Point) => {
      setClickPoint((p) => clickPoint ?? p);
      setSelectShow(active);
    }
  );
  const toggleTextTool = useEvent(
    (active: boolean, pointText?: paper.PointText) => {
      setPointText(pointText);
      setTextShow(active);
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
        toggleTextTool={toggleTextTool}
        toggleSelectTool={toggleSelectTool}
      />
      <SelectTool
        drawRef={drawRef}
        visible={selectShow}
        clickPoint={clickPoint}
      />
      {textShow && pointText && <TextTool pointText={pointText} />}
    </>
  );
};
