import React, { useState } from 'react';

export default function App() {
  const [calc, setCalc] = useState({
    current: "0",
    previous: "",
    operation: null,
    resetScreen: false
  });

  const clear = () => setCalc({ current: "0", previous: "", operation: null, resetScreen: false });

  const del = () => {
    setCalc(prev => {
      if (prev.resetScreen || prev.current === "Error") return { ...prev, current: "0", resetScreen: false };
      return { ...prev, current: prev.current.length === 1 ? "0" : prev.current.slice(0, -1) };
    });
  };

  const append = (num) => {
    setCalc(prev => {
      if (prev.resetScreen || prev.current === "Error") return { ...prev, current: num, resetScreen: false };
      if (num === "." && prev.current.includes(".")) return prev;
      if (prev.current === "0" && num !== ".") return { ...prev, current: num };
      return { ...prev, current: prev.current + num };
    });
  };

  const chooseOp = (op) => {
    setCalc(prev => {
      if (prev.current === "Error") return prev;
      if (prev.previous !== "" && !prev.resetScreen) {
        const p = parseFloat(prev.previous);
        const c = parseFloat(prev.current);
        let res = 0;
        if (prev.operation === '+') res = p + c;
        if (prev.operation === '-') res = p - c;
        if (prev.operation === '*') res = p * c;
        if (prev.operation === '/') {
          if (c === 0) return { current: "Error", previous: "", operation: null, resetScreen: true };
          res = p / c;
        }
        res = Math.round(res * 1e12) / 1e12;
        return { current: res.toString(), previous: res.toString(), operation: op, resetScreen: true };
      }
      return { ...prev, previous: prev.current, operation: op, resetScreen: true };
    });
  };

  const compute = () => {
    setCalc(prev => {
      if (!prev.operation || prev.previous === "") return prev;
      const p = parseFloat(prev.previous);
      const c = parseFloat(prev.current);
      let res = 0;
      if (prev.operation === '+') res = p + c;
      if (prev.operation === '-') res = p - c;
      if (prev.operation === '*') res = p * c;
      if (prev.operation === '/') {
        if (c === 0) return { current: "Error", previous: "", operation: null, resetScreen: true };
        res = p / c;
      }
      res = Math.round(res * 1e12) / 1e12;
      return { current: res.toString(), previous: "", operation: null, resetScreen: true };
    });
  };

  const percent = () => {
    setCalc(prev => {
      if (prev.current === "Error") return prev;
      return { ...prev, current: (parseFloat(prev.current) / 100).toString() };
    });
  };

  const toggleSign = () => {
    setCalc(prev => {
      if (prev.current === "Error" || prev.current === "0") return prev;
      return { ...prev, current: (parseFloat(prev.current) * -1).toString() };
    });
  };

  const formatDisplay = (num) => {
    if (num === "Error" || num === "") return num;
    const [integer, decimal] = num.split(".");
    const intDisplay = isNaN(parseFloat(integer)) ? "" : parseFloat(integer).toLocaleString("en", { maximumFractionDigits: 0 });
    return decimal != null ? `${intDisplay}.${decimal}` : intDisplay;
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Segoe UI", sans-serif; }
       

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111827;

  background-image:
    linear-gradient(
      rgba(17, 24, 39, 0.45),
      rgba(17, 24, 39, 0.45)
    ),
    url("/assets/background.jpg");

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  padding: 20px;
}


       .calculator {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(145deg, #17232c, #05080b);
  border: 3px solid #639ac0;
  border-radius: 28px;
  padding: 24px;
  box-shadow:
    0 0 0 5px #202a32,
    0 0 25px rgba(91, 163, 211, 0.35);
}
        .display {
  background: #030609;
  border: 2px solid #639ac0;
  border-radius: 16px;
  padding: 22px 16px;
  text-align: right;
  margin-bottom: 22px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.previous-operand {
  color: #8db9d8;
  font-size: 0.9rem;
  font-weight: 400;
  min-height: 22px;
  margin-bottom: 8px;
}


.current-operand {
  color: #ffffff;
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 1px;
  min-height: 55px;
  overflow-wrap: anywhere;
  text-shadow: 0 0 8px rgba(105, 180, 230, 0.3);
}
        .keypad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .btn { height: 60px; font-size: 1.25rem; font-weight: 500; border: none; border-radius: 12px; cursor: pointer; transition: filter 0.15s ease, transform 0.05s ease; user-select: none; }
        .btn:active { transform: scale(0.96); }
        .btn-num { background-color: #4338ca; color: #f8fafc; }
        .btn-fn { background-color: #5b21b6; color: #e2e8f0; }
        .btn-op { background-color: #ec4899; color: #ffffff; font-size: 1.4rem; }
        .btn-eq { background-color: #06b6d4; color: #ffffff; font-size: 1.4rem; }
        .btn:hover { filter: brightness(1.15); }
      `}</style>

      <div className="calculator">
        <div className="display">
          <div className="previous-operand">
            {formatDisplay(calc.previous)} {calc.operation && calc.operation.replace('*', '×').replace('/', '÷')}
          </div>
          <div className="current-operand">{formatDisplay(calc.current)}</div>
        </div>
        <div className="keypad">
          <button className="btn btn-fn" onClick={clear}>AC</button>
          <button className="btn btn-fn" onClick={del}>DEL</button>
          <button className="btn btn-fn" onClick={percent}>%</button>
          <button className="btn btn-op" onClick={() => chooseOp('/')}>÷</button>

          <button className="btn btn-num" onClick={() => append('7')}>7</button>
          <button className="btn btn-num" onClick={() => append('8')}>8</button>
          <button className="btn btn-num" onClick={() => append('9')}>9</button>
          <button className="btn btn-op" onClick={() => chooseOp('*')}>×</button>

          <button className="btn btn-num" onClick={() => append('4')}>4</button>
          <button className="btn btn-num" onClick={() => append('5')}>5</button>
          <button className="btn btn-num" onClick={() => append('6')}>6</button>
          <button className="btn btn-op" onClick={() => chooseOp('-')}>−</button>

          <button className="btn btn-num" onClick={() => append('1')}>1</button>
          <button className="btn btn-num" onClick={() => append('2')}>2</button>
          <button className="btn btn-num" onClick={() => append('3')}>3</button>
          <button className="btn btn-op" onClick={() => chooseOp('+')}>+</button>

          <button className="btn btn-num" onClick={toggleSign}>±</button>
          <button className="btn btn-num" onClick={() => append('0')}>0</button>
          <button className="btn btn-num" onClick={() => append('.')}>.</button>
          <button className="btn btn-eq" onClick={compute}>=</button>
        </div>
      </div>
    </>
  );
}
