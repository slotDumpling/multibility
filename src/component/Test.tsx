import React, { useEffect, useRef, useState } from "react";
import './test.sass'

export default function Test() {
  const inputEl = useRef<HTMLInputElement>(null);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (clicked) inputEl.current?.focus();
  }, [clicked])
  return (
    <>
      <input type="text" ref={inputEl} />
      <button onClick={() => setClicked(true)}>click</button>
    </>
  );
}
