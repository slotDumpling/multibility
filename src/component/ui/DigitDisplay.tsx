import classNames from "classnames";
import React, { useEffect, useState } from "react";
import "./digitDisplay.sass";

function num2digits(num: number): number[] {
  return String(num)
    .padStart(4, "0")
    .split("")
    .map((s) => Number(s));
}

export default function DigitDisplay({ value }: { value: number }) {
  const [randomNum, setRandomNum] = useState(9999);
  const displayNum = value >= 0 ? value : randomNum;
  const digits = num2digits(displayNum);

  function resetRandom() {
    setRandomNum(Math.floor(Math.random() * 10000));
  }
  useEffect(() => {
    if (value !== -1) return setRandomNum(9999);
    const timer = setTimeout(resetRandom, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={classNames("digit-display", { disabled: value === -2 })}>
      {digits.map((d, idx) => (
        <Digit key={idx} digit={d} />
      ))}
    </div>
  );
}

function Digit({ digit }: { digit: number }) {
  if (!(digit <= 9 && digit >= 0)) {
    return <div className="digit">*</div>;
  }
  return <div className="digit">{digit}</div>;
}
