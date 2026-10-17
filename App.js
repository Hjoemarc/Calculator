import React, { useState } from 'react';

const KEYS = [
  'AC', 'DEL', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '−',
  '1', '2', '3', '+',
  '0', '.', '=',
];

const OPS = { '÷': '/', '×': '*', '−': '-', '+': '+' };

const kind = (key) => {
  if (key === 'AC') return 'clear';
  if (key === '=') return 'equals';
  if (key in OPS) return 'op';
  if (key === 'DEL' || key === '%') return 'fn';
  return 'num';
};

const CSS = `
.calc-stage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #BFBCB4;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.calc-body {
  width: 100%;
  max-width: 340px;
  padding: 22px 20px 24px;
  border-radius: 10px;
  background: #DAD8D1;
  box-shadow:
    0 1px 0 #F4F2EC inset,
    0 -3px 0 #B9B6AD inset,
    0 24px 40px -12px rgba(40, 36, 28, 0.45),
    0 3px 0 #A9A69D;
}
.calc-display {
  padding: 14px 16px 12px;
  margin-bottom: 22px;
  border-radius: 4px;
  background: #B7C1A6;
  color: #1D2319;
  text-align: right;
  box-shadow: 0 2px 5px rgba(29, 35, 25, 0.35) inset, 0 1px 0 #F4F2EC;
  overflow: hidden;
}
.calc-expr {
  min-height: 22px;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: #4C5744;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
}
.calc-result {
  margin-top: 2px;
  font-size: 44px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
}
.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.calc-key {
  height: 58px;
  border: none;
  border-radius: 8px;
  font: inherit;
  font-size: 21px;
  font-weight: 500;
  cursor: pointer;
  color: var(--ink);
  background: var(--face);
  box-shadow: 0 4px 0 var(--edge), 0 6px 8px rgba(40, 36, 28, 0.25);
  transform: translateY(0);
  transition: transform 70ms ease-out, box-shadow 70ms ease-out;
}
.calc-key:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 var(--edge), 0 2px 3px rgba(40, 36, 28, 0.25);
}
.calc-key:focus-visible {
  outline: 3px solid #1D2319;
  outline-offset: 3px;
}
.calc-key[data-kind="num"]    { --face: #F3F1EB; --edge: #B3B0A6; --ink: #25241F; }
.calc-key[data-kind="fn"]     { --face: #A8A69E; --edge: #7C7A72; --ink: #25241F; }
.calc-key[data-kind="op"]     { --face: #3B3A36; --edge: #1B1A18; --ink: #F3F1EB; font-size: 24px; }
.calc-key[data-kind="clear"]  { --face: #E4572E; --edge: #A63A19; --ink: #FFF6EE; font-size: 18px; }
.calc-key[data-kind="equals"] { --face: #F2B705; --edge: #B08500; --ink: #25241F; grid-column: span 2; font-size: 26px; }
@media (prefers-reduced-motion: reduce) {
  .calc-key { transition: none; }
}
`;

export default function App() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');

  const press = (key) => {
    if (key === 'AC') {
      setExpr('');
      setResult('0');
    } else if (key === 'DEL') {
      setExpr(expr.slice(0, -1));
    } else if (key === '%') {
      setExpr(String(parseFloat(expr || result) / 100));
    } else if (key === '=') {
      try {
        const value = Function(`return ${expr.replace(/[÷×−]/g, (c) => OPS[c])}`)();
        setResult(String(Number.isFinite(value) ? +value.toFixed(10) : 'Error'));
        setExpr('');
      } catch {
        setResult('Error');
        setExpr('');
      }
    } else {
      setExpr(expr + key);
    }
  };

  return (
    <div className="calc-stage">
      <style>{CSS}</style>
      <div className="calc-body">
        <div className="calc-display" role="status" aria-live="polite">
          <div className="calc-expr">{expr}</div>
          <div className="calc-result">{result}</div>
        </div>

        <div className="calc-grid">
          {KEYS.map((key) => (
            <button
              key={key}
              className="calc-key"
              data-kind={kind(key)}
              onClick={() => press(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}