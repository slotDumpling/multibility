import { useEffect, useState } from "react";

export default function Test() {
  const [count, setCount] = useState(1);

  useEffect(() => console.log('render'))
  return <button onClick={() => setCount(1)}>{count}</button>;
}
