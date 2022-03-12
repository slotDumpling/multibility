import React, { useState } from "react";
import { DrawState } from "../lib/draw/DrawState";
import Draw from "./draw/Draw";

export default function Test() {
  const [ds, setDs] = useState(DrawState.createEmpty(500, 500));
  return (
    <>
      <Draw drawState={ds} onChange={setDs} finger />
      <h1>title</h1>
    </>
  );
}
