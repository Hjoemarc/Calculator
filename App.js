import React, { useState, useEffect } from 'react';

// Modified by Rifiel John Natividad
// New: 4 color themes, history panel, keyboard support, √ / x² / 1/x / ANS buttons

const THEMES = [
  { name: 'Midnight', bg: '#0b0f1a', card: '#1e1b4b', display: '#0b0f1a', num: '#4338ca', fn: '#5b21b6', op: '#ec4899', eq: '#06b6d4', text: '#f8fafc', sub: '#94a3b8' },
  { name: 'Ocean', bg: '#031c2b', card: '#0c4a6e', display: '#06283d', num: '#0369a1', fn: '#0e7490', op: '#f59e0b', eq: '#10b981', text: '#f0f9ff', sub: '#7dd3fc' },
  { name: 'Sunset', bg: '#2a0f1f', card: '#7c2d12', display: '#3b0d1f', num: '#9a3412', fn: '#be123c', op: '#facc15', eq: '#fb7185', text: '#fff7ed', sub: '#fdba74' },
  { name: 'Light', bg: '#e2e8f0', card: '#ffffff', display: '#f1f5f9', num: '#e2e8f0', fn: '#cbd5e1', op: '#6366f1', eq: '#10b981', text: '#0f172a', sub: '#64748b' },
];

const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const INITIAL = { current: '0', previous: '', operation: null, resetScreen: false };

const formatDisplay = (num) => {
  if (num === 'Error' || num === '' || num.includes('e')) return num;
  const [integer, decimal] = num.split('.');
  const intDisplay = isNaN(parseFloat(integer))
    ? (integer === '-' ? '-' : '')
    : parseFloat(integer).toLocaleString('en', { maximumFractionDigits: 0 });
  const sign = integer === '-0' ? '-' : '';
  return decimal != null ? `${sign}${intDisplay}.${decimal}` : `${sign}${intDisplay}`;
};

const calculate = (p, c, op) => {
  let res;
  if (op === '+') res = p + c;
  if (op === '-') res = p - c;
  if (op === '*') res = p * c;
  if (op === '/') {
    if (c === 0) return null;
    res = p / c;
  }
  return Math.round(res * 1e12) / 1e12;
};

export default function App() {
  const [calc, setCalc] = useState(INITIAL);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const t = THEMES[themeIndex];

  const addHistory = (expression, result) =>
    setHistory((h) => [{ expression, result }, ...h].slice(0, 20));

  const clear = () => setCalc(INITIAL);

  const del = () => {
    setCalc((prev) => {
      if (prev.resetScreen || prev.current === 'Error') return { ...prev, current: '0', resetScreen: false };
      const next = prev.current.length === 1 || (prev.current.length === 2 && prev.current.startsWith('-'))
        ? '0'
        : prev.current.slice(0, -1);
      return { ...prev, current: next };
    });
  };

  const append = (num) => {
    setCalc((prev) => {
      if (prev.resetScreen || prev.current === 'Error') return { ...prev, current: num === '.' ? '0.' : num, resetScreen: false };
      if (num === '.' && prev.current.includes('.')) return prev;
      if (prev.current === '0' && num !== '.') return { ...prev, current: num };
      if (prev.current.replace(/[-.]/g, '').length >= 15) return prev;
      return { ...prev, current: prev.current + num };
    });
  };

  const chooseOp = (op) => {
    if (calc.current === 'Error') return;
    if (calc.previous !== '' && !calc.resetScreen) {
      const p = parseFloat(calc.previous);
      const c = parseFloat(calc.current);
      const res = calculate(p, c, calc.operation);
      if (res === null) {
        setCalc({ current: 'Error', previous: '', operation: null, resetScreen: true });
        return;
      }
      addHistory(`${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`, res.toString());
      setCalc({ current: res.toString(), previous: res.toString(), operation: op, resetScreen: true });
      return;
    }
    setCalc({ ...calc, previous: calc.current, operation: op, resetScreen: true });
  };

  const compute = () => {
    if (!calc.operation || calc.previous === '') return;
    const p = parseFloat(calc.previous);
    const c = parseFloat(calc.current);
    const res = calculate(p, c, calc.operation);
    if (res === null) {
      setCalc({ current: 'Error', previous: '', operation: null, resetScreen: true });
      return;
    }
    addHistory(`${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`, res.toString());
    setCalc({ current: res.toString(), previous: '', operation: null, resetScreen: true });
  };

  const percent = () => {
    if (calc.current === 'Error') return;
    setCalc({ ...calc, current: (parseFloat(calc.current) / 100).toString() });
  };

  const toggleSign = () => {
    if (calc.current === 'Error' || calc.current === '0') return;
    setCalc({ ...calc, current: (parseFloat(calc.current) * -1).toString() });
  };

  // Unary functions: √, x², 1/x
  const unary = (type) => {
    if (calc.current === 'Error') return;
    const x = parseFloat(calc.current);
    let res;
    let label;
    if (type === 'sqrt') {
      if (x < 0) { setCalc({ ...INITIAL, current: 'Error', resetScreen: true }); return; }
      res = Math.sqrt(x);
      label = `√(${formatDisplay(calc.current)})`;
    }
    if (type === 'square') {
      res = x * x;
      label = `(${formatDisplay(calc.current)})²`;
    }
    if (type === 'inverse') {
      if (x === 0) { setCalc({ ...INITIAL, current: 'Error', resetScreen: true }); return; }
      res = 1 / x;
      label = `1/(${formatDisplay(calc.current)})`;
    }
    res = Math.round(res * 1e12) / 1e12;
    addHistory(label, res.toString());
    setCalc({ ...calc, current: res.toString(), resetScreen: true });
  };

  // ANS inserts the last result from history
  const ans = () => {
    if (history.length === 0) return;
    setCalc({ ...calc, current: history[0].result, resetScreen: false });
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) append(k);
      else if (k === '.') append('.');
      else if (['+', '-', '*', '/'].includes(k)) { e.preventDefault(); chooseOp(k); }
      else if (k === 'Enter' || k === '=') { e.preventDefault(); compute(); }
      else if (k === 'Backspace') del();
      else if (k === 'Escape') clear();
      else if (k === '%') percent();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const cssVars = {
    '--bg': t.bg, '--card': t.card, '--display': t.display, '--num': t.num, '--fn': t.fn,
    '--op': t.op, '--eq': t.eq, '--text': t.text, '--sub': t.sub,
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, 'Segoe UI', sans-serif; }
        .page { width: 100vw; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); transition: background 0.4s ease; padding: 16px; gap: 16px; flex-wrap: wrap; }
        .calculator { width: 100%; max-width: 340px; background: var(--card); border-radius: 24px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.35); transition: background 0.4s ease; }
        .topbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .brand { color: var(--text); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.04em; }
        .brand small { display: block; color: var(--sub); font-weight: 400; font-size: 0.7rem; }
        .top-actions { display: flex; gap: 8px; }
        .chip { white-space: nowrap; border: none; border-radius: 999px; padding: 6px 12px; font-size: 0.75rem; font-weight: 600; cursor: pointer; background: var(--display); color: var(--text); }
        .chip:hover { filter: brightness(1.2); }
        .display { background: var(--display); border-radius: 14px; padding: 18px 16px; text-align: right; margin-bottom: 18px; min-height: 92px; display: flex; flex-direction: column; justify-content: space-between; word-break: break-all; transition: background 0.4s ease; }
        .previous-operand { color: var(--sub); font-size: 1rem; min-height: 20px; }
        .current-operand { color: var(--text); font-size: 2.2rem; font-weight: 600; line-height: 1.1; }
        .keypad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .btn { height: 56px; font-size: 1.2rem; font-weight: 500; border: none; border-radius: 16px; cursor: pointer; transition: filter 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease; user-select: none; }
        .btn:active { transform: scale(0.93); }
        .btn:hover { filter: brightness(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
        .btn-num { background: var(--num); color: var(--text); }
        .btn-fn { background: var(--fn); color: var(--text); }
        .btn-sci { background: var(--display); color: var(--text); font-size: 1rem; }
        .btn-op { background: var(--op); color: #ffffff; font-size: 1.4rem; }
        .btn-eq { background: var(--eq); color: #ffffff; font-size: 1.4rem; }
        .history { width: 100%; max-width: 280px; background: var(--card); border-radius: 24px; padding: 18px; max-height: 520px; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.35); }
        .history h3 { color: var(--text); font-size: 0.95rem; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .history-item { background: var(--display); border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; text-align: right; cursor: pointer; }
        .history-item:hover { filter: brightness(1.2); }
        .history-item .expr { color: var(--sub); font-size: 0.8rem; }
        .history-item .res { color: var(--text); font-size: 1.1rem; font-weight: 600; }
        .empty { color: var(--sub); font-size: 0.85rem; text-align: center; padding: 20px 0; }
      `}</style>

      <div className="page" style={cssVars}>
        <div className="calculator">
          <div className="topbar">
            <div className="brand">
              CALCULATOR
              <small>by Rifiel Natividad</small>
            </div>
            <div className="top-actions">
              <button className="chip" onClick={() => setThemeIndex((themeIndex + 1) % THEMES.length)}>
                🎨 {t.name}
              </button>
              <button className="chip" onClick={() => setShowHistory(!showHistory)}>
                🕘 History
              </button>
            </div>
          </div>

          <div className="display">
            <div className="previous-operand">
              {formatDisplay(calc.previous)} {calc.operation && SYMBOLS[calc.operation]}
            </div>
            <div className="current-operand">{formatDisplay(calc.current)}</div>
          </div>

          <div className="keypad">
            <button className="btn btn-sci" onClick={() => unary('sqrt')}>√</button>
            <button className="btn btn-sci" onClick={() => unary('square')}>x²</button>
            <button className="btn btn-sci" onClick={() => unary('inverse')}>1/x</button>
            <button className="btn btn-sci" onClick={ans}>ANS</button>

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

        {showHistory && (
          <div className="history">
            <h3>
              History
              <button className="chip" onClick={() => setHistory([])}>Clear</button>
            </h3>
            {history.length === 0 ? (
              <div className="empty">No calculations yet</div>
            ) : (
              history.map((item, i) => (
                <div
                  key={i}
                  className="history-item"
                  onClick={() => setCalc({ ...INITIAL, current: item.result })}
                >
                  <div className="expr">{item.expression} =</div>
                  <div className="res">{formatDisplay(item.result)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}