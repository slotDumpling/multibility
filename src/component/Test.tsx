import React, { useEffect, useState } from "react";
import "./test.sass";

export default function Test() {
  const [count, setCount] = useState(1);
  useEffect(() => () => console.log(count), [count]);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>click</button>
    </div>
  );
}
