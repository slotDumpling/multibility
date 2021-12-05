import React, { useState } from "react";
import "./App.css";
import Draw from "./component/draw/Draw";
import { DrawState } from "./component/draw/lib/DrawState";

const width = 2000;
const height = 2000;

function App() {
  const [drawState, setDrawState] = useState<DrawState>(() =>
    DrawState.createEmpty(width, height)
  );
  const [erasing, setErasing] = useState(false);
  const [even, setEven] = useState(true);
  const [lineWidth, setLineWidth] = useState(20);

  function undo() {
    setDrawState(DrawState.undo(drawState));
  }

  function redo() {
    setDrawState(DrawState.redo(drawState));
  }

  return (
    <>
      <Draw
        width={width}
        height={height}
        drawState={drawState}
        onChange={setDrawState}
        erasing={erasing}
        even={even}
        lineWidth={lineWidth}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
        <span>
          <input
            type="checkbox"
            checked={erasing}
            onChange={(e) => void setErasing(e.target.checked)}
          />
          <label>eraser</label>
        </span>
        <span>
          <input
            type="checkbox"
            checked={even}
            onChange={(e) => void setEven(e.target.checked)}
          />
          <label>even</label>
        </span>
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => void setLineWidth(parseInt(e.target.value, 10) || 0)}
        />
      </div>
    </>
  );
}

export default App;
