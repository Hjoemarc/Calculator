import React, { useState, useEffect } from 'react';

// Modified by June Mark C. Undik
// Modified by Diana Rose Mantos
// New design: Gradient background, glass effect, color themes, calculation history, and scientific buttons.
// Added: memory buttons (MC/MR/M+/M−) and tap-to-copy result

const THEMES = [
  { name: 'Midnight', bg: '#11369c', card: '#1e1b4b', display: '#0b0f1a', num: '#4338ca', fn: '#5b21b6', op: '#ec4899', eq: '#06b6d4', text: '#f8fafc', sub: '#94a3b8' },
  { name: 'Ocean', bg: '#031c2b', card: '#0c4a6e', display: '#06283d', num: '#0369a1', fn: '#0e7490', op: '#f59e0b', eq: '#10b981', text: '#f0f9ff', sub: '#7dd3fc' },
  { name: 'Sunset', bg: '#e13a9ec1', card: '#7c2d12', display: '#3b0d1f', num: '#9a3412', fn: '#be123c', op: '#facc15', eq: '#fb7185', text: '#fff7ed', sub: '#fdba74' },
  { name: 'Light', bg: '#e2e8f0', card: '#ffffff', display: '#f1f5f9', num: '#e2e8f0', fn: '#cbd5e1', op: '#6366f1', eq: '#10b981', text: '#0f172a', sub: '#64748b' },
];

const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const INITIAL = { current: '0', previous: '', operation: null, resetScreen: false };

// Money converter added by Lander Fernando
const RATES = { Peso: 62.9, USD: 1, JPY: 158, EUR: 0.89, KRW: 1340 };

const formatDisplay = (num) => {
  if (num === 'Error' || num === '' || num.includes('e')) return num;

  const [integer, decimal] = num.split('.');
  const intDisplay = isNaN(parseFloat(integer))
    ? integer === '-' ? '-' : ''
    : parseFloat(integer).toLocaleString('en', {
        maximumFractionDigits: 0,
      });

  const sign = integer === '-0' ? '-' : '';

  return decimal != null
    ? `${sign}${intDisplay}.${decimal}`
    : `${sign}${intDisplay}`;
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
  const [convertMode, setConvertMode] = useState(false);
  const [fromCur, setFromCur] = useState('Peso');
  const [toCur, setToCur] = useState('USD');
  const [memory, setMemory] = useState(0);
  const [copied, setCopied] = useState(false);

  const t = THEMES[themeIndex];

  const converted =
    calc.current === 'Error'
      ? 'Error'
      : ((parseFloat(calc.current) / RATES[fromCur]) * RATES[toCur]).toLocaleString('en', {
          maximumFractionDigits: 2,
        });

  const addHistory = (expression, result) =>
    setHistory((h) => [{ expression, result }, ...h].slice(0, 20));

  const clear = () => setCalc(INITIAL);

  const del = () => {
    setCalc((prev) => {
      if (prev.resetScreen || prev.current === 'Error') {
        return { ...prev, current: '0', resetScreen: false };
      }

      const next =
        prev.current.length === 1 ||
        (prev.current.length === 2 && prev.current.startsWith('-'))
          ? '0'
          : prev.current.slice(0, -1);

      return { ...prev, current: next };
    });
  };

  const append = (num) => {
    setCalc((prev) => {
      if (prev.resetScreen || prev.current === 'Error') {
        return {
          ...prev,
          current: num === '.' ? '0.' : num,
          resetScreen: false,
        };
      }

      if (num === '.' && prev.current.includes('.')) return prev;

      if (prev.current === '0' && num !== '.') {
        return { ...prev, current: num };
      }

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
        setCalc({
          current: 'Error',
          previous: '',
          operation: null,
          resetScreen: true,
        });
        return;
      }

      addHistory(
        `${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`,
        res.toString()
      );

      setCalc({
        current: res.toString(),
        previous: res.toString(),
        operation: op,
        resetScreen: true,
      });

      return;
    }

    setCalc({
      ...calc,
      previous: calc.current,
      operation: op,
      resetScreen: true,
    });
  };

  const compute = () => {
    if (!calc.operation || calc.previous === '') return;

    const p = parseFloat(calc.previous);
    const c = parseFloat(calc.current);
    const res = calculate(p, c, calc.operation);

    if (res === null) {
      setCalc({
        current: 'Error',
        previous: '',
        operation: null,
        resetScreen: true,
      });
      return;
    }

    addHistory(
      `${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`,
      res.toString()
    );

    setCalc({
      current: res.toString(),
      previous: '',
      operation: null,
      resetScreen: true,
    });
  };

  const percent = () => {
    if (calc.current === 'Error') return;

    setCalc({
      ...calc,
      current: (parseFloat(calc.current) / 100).toString(),
    });
  };

  const toggleSign = () => {
    if (calc.current === 'Error' || calc.current === '0') return;

    setCalc({
      ...calc,
      current: (parseFloat(calc.current) * -1).toString(),
    });
  };

  // Scientific calculator functions
  const unary = (type) => {
    if (calc.current === 'Error') return;

    const x = parseFloat(calc.current);
    let res;
    let label;

    if (type === 'sqrt') {
      if (x < 0) {
        setCalc({ ...INITIAL, current: 'Error', resetScreen: true });
        return;
      }

      res = Math.sqrt(x);
      label = `√(${formatDisplay(calc.current)})`;
    }

    if (type === 'square') {
      res = x * x;
      label = `(${formatDisplay(calc.current)})²`;
    }

    if (type === 'inverse') {
      if (x === 0) {
        setCalc({ ...INITIAL, current: 'Error', resetScreen: true });
        return;
      }

      res = 1 / x;
      label = `1/(${formatDisplay(calc.current)})`;
    }

    res = Math.round(res * 1e12) / 1e12;

    addHistory(label, res.toString());

    setCalc({
      ...calc,
      current: res.toString(),
      resetScreen: true,
    });
  };

  // ANS uses the most recent calculation result
  const ans = () => {
    if (history.length === 0) return;

    setCalc({
      ...calc,
      current: history[0].result,
      resetScreen: false,
    });
  };

  // Memory functions (Diana Rose Mantos)
  const memClear = () => setMemory(0);

  const memRecall = () => {
    setCalc({ ...calc, current: memory.toString(), resetScreen: true });
  };

  const memAdd = (sign) => {
    if (calc.current === 'Error') return;
    const value = parseFloat(calc.current);
    setMemory((m) => Math.round((m + sign * value) * 1e12) / 1e12);
    setCalc({ ...calc, resetScreen: true });
  };

  // Copy the current result to the clipboard (Diana Rose Mantos)
  const copyResult = () => {
    if (calc.current === 'Error') return;
    if (navigator.clipboard) navigator.clipboard.writeText(calc.current);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;

      if (/^[0-9]$/.test(k)) append(k);
      else if (k === '.') append('.');
      else if (['+', '-', '*', '/'].includes(k)) {
        e.preventDefault();
        chooseOp(k);
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        compute();
      } else if (k === 'Backspace') {
        del();
      } else if (k === 'Escape') {
        clear();
      } else if (k === '%') {
        percent();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  });

  const cssVars = {
    '--bg': t.bg,
    '--card': t.card,
    '--display': t.display,
    '--num': t.num,
    '--fn': t.fn,
    '--op': t.op,
    '--eq': t.eq,
    '--text': t.text,
    '--sub': t.sub,
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, 'Segoe UI', sans-serif;
        }

        .page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at top left, color-mix(in srgb, var(--eq) 28%, transparent), transparent 38%),
            radial-gradient(circle at bottom right, color-mix(in srgb, var(--op) 24%, transparent), transparent 42%),
            var(--bg);
          transition: background 0.4s ease;
          padding: 24px 16px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .calculator {
          width: 100%;
          max-width: 360px;
          background: color-mix(in srgb, var(--card) 88%, transparent);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 30px;
          padding: 22px;
          box-shadow:
            0 24px 70px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          transition: background 0.4s ease, transform 0.25s ease;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .brand {
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .brand small {
          display: block;
          color: var(--sub);
          font-weight: 500;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          margin-top: 5px;
        }

        .top-actions {
          display: flex;
          gap: 8px;
        }

        .chip {
          white-space: nowrap;
          border: none;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          background: var(--display);
          color: var(--text);
        }

        .chip:hover {
          filter: brightness(1.2);
        }

        .display {
          background: linear-gradient(
            145deg,
            var(--display),
            color-mix(in srgb, var(--display) 72%, var(--eq))
          );
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px 16px;
          text-align: right;
          margin-bottom: 20px;
          min-height: 108px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          word-break: break-all;
          box-shadow: inset 0 3px 12px rgba(0,0,0,0.16);
          transition: background 0.4s ease;
        }

        .previous-operand {
          color: var(--sub);
          font-size: 1rem;
          min-height: 20px;
        }

        .current-operand {
          color: var(--text);
          font-size: 2.35rem;
          font-weight: 750;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .keypad {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }

        .btn {
          height: 58px;
          font-size: 1.2rem;
          font-weight: 650;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          cursor: pointer;
          transition:
            filter 0.15s ease,
            transform 0.12s ease,
            box-shadow 0.15s ease;
          user-select: none;
        }

        .btn:active {
          transform: scale(0.93);
        }

        .btn:hover {
          filter: brightness(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }

        /* Cyberpunk Neon Design Styles */
        .btn-num {
          background: color-mix(in srgb, var(--display) 90%, black);
          color: var(--text);
          border-radius: 14px;
          border: 1.5px solid color-mix(in srgb, var(--eq) 60%, transparent);
          box-shadow: 0 0 10px color-mix(in srgb, var(--eq) 20%, transparent);
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .btn-num:hover {
          border-color: var(--eq);
          box-shadow: 0 0 16px color-mix(in srgb, var(--eq) 50%, transparent);
          filter: brightness(1.2);
        }

        .btn-num:active {
          transform: scale(0.95);
        }

        .btn-fn {
          background: linear-gradient(
            145deg,
            var(--fn),
            color-mix(in srgb, var(--fn) 75%, #ffffff)
          );
          color: var(--text);
        }

        .btn-sci {
          background: var(--display);
          color: var(--text);
          font-size: 1rem;
        }

        .btn-mem {
          height: 40px;
          background: transparent;
          color: var(--eq);
          border: 1px solid var(--eq);
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .btn-mem:hover {
          background: color-mix(in srgb, var(--eq) 22%, transparent);
        }

        .btn-op {
          background: color-mix(in srgb, var(--display) 85%, black);
          color: var(--op);
          border-radius: 14px;
          border: 1.5px solid color-mix(in srgb, var(--op) 70%, transparent);
          font-size: 1.4rem;
          font-weight: 800;
          box-shadow: 0 0 12px color-mix(in srgb, var(--op) 30%, transparent);
          transition: all 0.2s ease;
        }

        .btn-op:hover {
          border-color: var(--op);
          box-shadow: 0 0 20px color-mix(in srgb, var(--op) 60%, transparent);
          filter: brightness(1.3);
        }

        .btn-eq {
          background: var(--eq);
          color: #000;
          border-radius: 14px;
          border: 1.5px solid var(--eq);
          font-size: 1.4rem;
          font-weight: 900;
          box-shadow: 0 0 16px color-mix(in srgb, var(--eq) 70%, transparent);
        }

        .history {
          width: 100%;
          max-width: 300px;
          background: color-mix(in srgb, var(--card) 90%, transparent);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 26px;
          padding: 20px;
          max-height: 520px;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.32);
          backdrop-filter: blur(18px);
        }

        .history h3 {
          color: var(--text);
          font-size: 0.95rem;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-item {
          background: var(--display);
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 8px;
          text-align: right;
          cursor: pointer;
        }

        .history-item:hover {
          filter: brightness(1.2);
        }

        .history-item .expr {
          color: var(--sub);
          font-size: 0.8rem;
        }

        .history-item .res {
          color: var(--text);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .empty {
          color: var(--sub);
          font-size: 0.85rem;
          text-align: center;
          padding: 20px 0;
        }

        .signature {
          color: var(--sub);
          font-size: 0.72rem;
          text-align: center;
          margin-top: 16px;
          letter-spacing: 0.04em;
        }

        .converter-display {
          justify-content: center;
          gap: 14px;
        }

        .conv-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
        }

        .conv-divider {
          height: 1px;
          width: 100%;
          background: rgba(255,255,255,0.15);
        }

        .conv-amount {
          flex: 1;
          min-width: 0;
          color: var(--text);
          font-size: 1.8rem;
          font-weight: 750;
          letter-spacing: -0.03em;
          text-align: right;
          word-break: break-all;
        }

        .converter-display select {
          background: var(--card);
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 6px 8px;
          font-size: 0.9rem;
        }

        .btn-conv {
          grid-column: 1 / -1;
          height: 44px;
          background: var(--display);
          color: var(--text);
          font-size: 1rem;
          border-radius: 14px;
        }

        .btn-conv.active {
          background: var(--eq);
          color: #ffffff;
        }

        @media (max-width: 420px) {
          .calculator {
            padding: 16px;
            border-radius: 24px;
          }

          .btn {
            height: 52px;
            border-radius: 14px;
          }

          .page {
            align-items: flex-start;
            padding: 12px 12px 40px;
          }

          .display {
            min-height: 96px;
            margin-bottom: 14px;
          }

          .btn-mem {
            height: 36px;
          }

          .btn-conv {
            height: 44px;
          }

          .keypad {
            gap: 8px;
          }

          .current-operand {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="page" style={cssVars}>
        <div className="calculator">
          <div className="topbar">
            <div className="brand">
              CALCULATOR
              <small>by June Mark</small>
            </div>

            <div className="top-actions">
              <button
                className="chip"
                onClick={() =>
                  setThemeIndex((themeIndex + 1) % THEMES.length)
                }
              >
                🎨 {t.name}
              </button>

              <button
                className="chip"
                onClick={() => setShowHistory(!showHistory)}
              >
                🕘 History
              </button>
            </div>
          </div>

          {!convertMode && (
            <div
              className="display"
              onClick={copyResult}
              title="Tap to copy result"
              style={{ cursor: 'pointer' }}
            >
              <div className="previous-operand">
                {copied
                  ? '✓ Copied!'
                  : `${memory !== 0 ? 'M  ' : ''}${formatDisplay(calc.previous)} ${
                      calc.operation ? SYMBOLS[calc.operation] : ''
                    }`}
              </div>

              <div className="current-operand">
                {formatDisplay(calc.current)}
              </div>
            </div>
          )}

          {convertMode && (
            <div className="display converter-display">
              <div className="conv-row">
                <select value={fromCur} onChange={(e) => setFromCur(e.target.value)}>
                  {Object.keys(RATES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="conv-amount">{formatDisplay(calc.current)}</div>
              </div>

              <div className="conv-divider" />

              <div className="conv-row">
                <select value={toCur} onChange={(e) => setToCur(e.target.value)}>
                  {Object.keys(RATES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="conv-amount">{converted}</div>
              </div>
            </div>
          )}

          <div className="keypad">
            <button className="btn btn-mem" onClick={memClear}>
              MC
            </button>

            <button className="btn btn-mem" onClick={memRecall}>
              MR
            </button>

            <button className="btn btn-mem" onClick={() => memAdd(1)}>
              M+
            </button>

            <button className="btn btn-mem" onClick={() => memAdd(-1)}>
              M−
            </button>

            <button className="btn btn-sci" onClick={() => unary('sqrt')}>
              √
            </button>

            <button className="btn btn-sci" onClick={() => unary('square')}>
              x²
            </button>

            <button className="btn btn-sci" onClick={() => unary('inverse')}>
              1/x
            </button>

            <button className="btn btn-sci" onClick={ans}>
              ANS
            </button>

            <button className="btn btn-fn" onClick={clear}>
              AC
            </button>

            <button className="btn btn-fn" onClick={del}>
              DEL
            </button>

            <button className="btn btn-fn" onClick={percent}>
              %
            </button>

            <button className="btn btn-op" onClick={() => chooseOp('/')}>
              ÷
            </button>

            <button className="btn btn-num" onClick={() => append('7')}>
              7
            </button>

            <button className="btn btn-num" onClick={() => append('8')}>
              8
            </button>

            <button className="btn btn-num" onClick={() => append('9')}>
              9
            </button>

            <button className="btn btn-op" onClick={() => chooseOp('*')}>
              ×
            </button>

            <button className="btn btn-num" onClick={() => append('4')}>
              4
            </button>

            <button className="btn btn-num" onClick={() => append('5')}>
              5
            </button>

            <button className="btn btn-num" onClick={() => append('6')}>
              6
            </button>

            <button className="btn btn-op" onClick={() => chooseOp('-')}>
              −
            </button>

            <button className="btn btn-num" onClick={() => append('1')}>
              1
            </button>

            <button className="btn btn-num" onClick={() => append('2')}>
              2
            </button>

            <button className="btn btn-num" onClick={() => append('3')}>
              3
            </button>

            <button className="btn btn-op" onClick={() => chooseOp('+')}>
              +
            </button>

            <button className="btn btn-num" onClick={toggleSign}>
              ±
            </button>

            <button className="btn btn-num" onClick={() => append('0')}>
              0
            </button>

            <button className="btn btn-num" onClick={() => append('.')}>
              .
            </button>

            <button className="btn btn-eq" onClick={compute}>
              =
            </button>

            <button
              className={`btn btn-conv ${convertMode ? 'active' : ''}`}
              onClick={() => setConvertMode(!convertMode)}
            >
              {convertMode ? '← Calculator' : '⇄ Convert'}
            </button>
          </div>

          <div className="signature">
            DESIGNED BY JUNE MARK C. UNDIK
          </div>
        </div>

        {showHistory && (
          <div className="history">
            <h3>
              History
              <button className="chip" onClick={() => setHistory([])}>
                Clear
              </button>
            </h3>

            {history.length === 0 ? (
              <div className="empty">No calculations yet</div>
            ) : (
              history.map((item, i) => (
                <div
                  key={i}
                  className="history-item"
                  onClick={() =>
                    setCalc({ ...INITIAL, current: item.result })
                  }
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