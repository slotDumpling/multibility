import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./digitInput.css";

export default function DigitInput({
  value = 0,
  digitNum = 4,
  onChange = () => {},
  onSubmit,
}: {
  value?: number;
  digitNum?: number;
  onChange?: (val: number) => void;
  onSubmit: (val: number) => void;
}) {
  function num2digits(num: number): string[] {
    if (num === 0) return new Array(digitNum).fill("");
    return String(num)
      .slice(0, digitNum)
      .padEnd(digitNum, "x")
      .split("")
      .map((s) => (s === "x" ? "" : s));
  }

  const [nowFocused, setNowFocused] = useState(0);
  const [digits, setDigits] = useState(num2digits(value));
  useEffect(() => {
    const newDigits = num2digits(value);
    setDigits(newDigits);
  }, [value]);

  useEffect(() => {
    const idx = digits.findIndex((d) => d === "");
    setNowFocused(idx);
    const newValue = Number(digits.join(""));
    if (newValue === value) return;
    onChange(newValue);
    if (idx === -1) {
      onSubmit(newValue);
    }
  }, [digits]);

  function focus() {
    if (nowFocused === -1) {
      inputRefs.current.forEach((el) => el.blur());
    } else {
      inputRefs.current[nowFocused].focus();
    }
  }

  useEffect(() => {
    focus();
  }, [nowFocused]);

  function handleChange(val: string, idx: number) {
    if (!/^[0-9]$/.test(val)) return;
    setDigits(prev => {
      const newDigits = prev.slice();
      newDigits[idx] = val;
      return newDigits;
    });
  }

  const inputRefs = useRef<HTMLInputElement[]>([]);
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, digitNum);
  }, [digitNum]);

  function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const idx = Math.max(0, nowFocused - 1);
      setNowFocused(idx);
      setDigits(prev => {
        const newDigits = prev.slice();
        newDigits[idx] = '';
        return newDigits;
      });
    }
  }

  return (
    <div className="digit-input">
      {digits.map((d, idx) => (
        <input
          key={idx}
          ref={(el) => {
            if (!el) return;
            inputRefs.current[idx] = el;
          }}
          value={d}
          pattern="\d*"
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyUp={handleKeyUp}
        />
      ))}
      <div className="click-area" onClick={focus}></div>
    </div>
  );
}
