import Drawdisplay from "./DrawDisplay";
import Drawinput from "./DrawInput";
import { DrawState, SetDrawState } from "../../lib/draw/DrawState";
import "./draw.css";

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
  const method = erasing ? DrawState.eraseStrokes : DrawState.addStroke;

  return (
    <div className="draw-wrapper">
      <Drawdisplay drawState={drawState} />
      <Drawinput
        drawState={drawState}
        method={method}
        finger={finger}
        even={even}
        lineWidth={lineWidth}
        setDrawState={onChange}
      />
    </div>
  );
}
