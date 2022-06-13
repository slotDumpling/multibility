import { CSSProperties, useRef } from "react";

const boxStyle: CSSProperties = {
  width: 500,
  height: 500,
  marginBottom: 20,
  backgroundColor: 'red',
}

export default function Test() {
  const ref = useRef<HTMLDivElement>(null)

  return <>
    <div style={boxStyle}></div>
    <div style={boxStyle}></div>
    <div style={boxStyle}></div>
    <div style={boxStyle}></div>
    <div style={boxStyle}></div>
    <div ref={ref} style={boxStyle}></div>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0009',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <button onClick={() => ref.current?.scrollIntoView()}>scroll</button>
    </div>
  </>;
}
