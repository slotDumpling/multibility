import React from "react";
import { useSwipeable } from "react-swipeable";

export default function Test() {
  const handler = useSwipeable({
    onSwipedLeft() {
      console.log('swiped');
    },
    trackMouse: true,
  })
  return (
    <div
      style={{
        height: 300,
        width: 300,
        background: "red",
      }}
      {...handler}
    ></div>
  );
}
