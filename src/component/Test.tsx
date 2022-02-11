import { Input } from "antd";
import React, { useState } from "react";

export default function Test() {
  const [text, setText] = useState("");
  return (
    <>
      <h1>{text}</h1>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <input type="text" />
    </>
  );
}
