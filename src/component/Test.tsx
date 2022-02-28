import React, { useEffect, useRef } from "react";

export default function Test() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = cvsRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(100, 0, 100, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.quadraticCurveTo(100, 200, 200, 200);
    ctx.stroke();
    return () => ctx.clearRect(0, 0, 300, 300)
  }, [])
  return (
    <div>
      <canvas width={1000} height={1000} ref={cvsRef} onMouseMove={({clientX, clientY}) => {
        console.log(clientX, clientY);
        const ctx = cvsRef.current?.getContext('2d');
        if (!ctx) return;
        console.time('in');
        console.assert(
          !ctx.isPointInStroke(clientX, clientY)
          )
        console.timeEnd('in');
      }}></canvas>
    </div>
  );
}
