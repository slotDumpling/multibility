import Drawdisplay from "./DrawDisplay";
import Drawinput from "./DrawInput";
import { DrawState, SetDrawState } from "./lib/DrawState";

export default function Draw({
  drawState,
  onChange,
  erasing = false,
  finger = false,
  even = true,
  lineWidth = 10,
  width = 100,
  height = 100,
}: {
  drawState: DrawState;
  onChange: SetDrawState;
  erasing?: boolean;
  finger?: boolean;
  even?: boolean;
  lineWidth?: number;
  width?: number;
  height?: number;
}) {
  const method = erasing ? DrawState.eraseStrokes : DrawState.pushStroke;

  return (
    <>
      <Drawdisplay width={width} height={height} drawState={drawState} />
      <Drawinput
        method={method}
        width={width}
        height={height}
        finger={finger}
        even={even}
        lineWidth={lineWidth}
        setDrawState={onChange}
      />
    </>
  );
}
