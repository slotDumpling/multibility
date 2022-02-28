import Drawdisplay from "./DrawDisplay";
import DrawInput from "./DrawInput";
import { DrawState, SetDrawState } from "../../lib/draw/DrawState";
import "./draw.css";
import { useMemo, useRef } from "react";
import { CtxRecord, Eraser } from "../../lib/draw/eraser";

export interface DrawCtrl {
  erasing: boolean;
  finger: boolean;
  even: boolean;
  lineWidth: number;
  color: string;
}

export default function Draw({
  drawState,
  onChange,
  erasing = false,
  finger = false,
  even = true,
  lineWidth = 10,
}: {
  drawState: DrawState;
  onChange: SetDrawState;
  erasing?: boolean;
  finger?: boolean;
  even?: boolean;
  lineWidth?: number;
}) {
  const cache = useRef<CtxRecord>({});
  const eraser = useMemo(() => {
    const res = new Eraser(drawState, cache.current);
    cache.current = res.ctxRec;
    return res;
  }, [drawState]);

  return (
    <div className="draw-wrapper">
      <Drawdisplay drawState={drawState} />
      <DrawInput
        drawState={drawState}
        finger={finger}
        even={even}
        lineWidth={lineWidth}
        setDrawState={onChange}
        eraser={eraser}
        erasing={erasing}
      />
    </div>
  );
}
