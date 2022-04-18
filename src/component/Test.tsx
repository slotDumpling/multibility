import React from "react";
import { useSwipeable } from "react-swipeable";
import './test.sass'

export default function Test() {
  return (
    <>
      <label>
        <input type="radio" name="color" />
        <span>apple</span>
      </label>
      <label>
        <input type="radio" name="color" />
        <span>apple</span>
      </label>
    </>
  );
}
