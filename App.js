
import React, { useState, useEffect } from 'react';

const THEMES = [
  {
    name: 'AimS Red',
    bg: '#08090D',
    card: '#151720',
    display: '#0B0D12',
    num: '#20232D',
    fn: '#343744',
    op: '#FF4655',
    eq: '#FF3347',
    text: '#F8FAFC',
    sub: '#9CA3AF',
  },
  {
    name: 'Ocean',
    bg: '#031c2b',
    card: '#0c4a6e',
    display: '#06283d',
    num: '#0369a1',
    fn: '#0e7490',
    op: '#f59e0b',
    eq: '#10b981',
    text: '#f0f9ff',
    sub: '#7dd3fc',
  },
  {
    name: 'Sunset',
    bg: '#35101F',
    card: '#7c2d12',
    display: '#3b0d1f',
    num: '#9a3412',
    fn: '#be123c',
    op: '#facc15',
    eq: '#fb7185',
    text: '#fff7ed',
    sub: '#fdba74',
  },
  {
    name: 'Light',
    bg: '#e2e8f0',
    card: '#ffffff',
    display: '#f1f5f9',
    num: '#e2e8f0',
    fn: '#cbd5e1',
    op: '#6366f1',
    eq: '#10b981',
    text: '#0f172a',
    sub: '#64748b',
  },
  {
    name: 'Juliana Bloom',
    bg: '#FFF0F6',
    card: '#FFFFFF',
    display: '#FFF7FB',
    num: '#FCE7F3',
    fn: '#86255c',
    op: '#DB2777',
    eq: '#10B981',
    text: '#831843',
    sub: '#BE185D',
  },
];

const SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

const INITIAL = {
  current: '0',
  previous: '',
  operation: null,
  resetScreen: false,
};

// Approximate conversion rates relative to USD.
// Update these values before relying on currency conversions.
const RATES = {
  Peso: 56,
  USD: 1,
  JPY: 150,
  EUR: 0.92,
  KRW: 1350,
};

const formatDisplay = (num) => {
  if (num === 'Error' || num === '' || num.includes('e')) {
    return num;
  }

  const [integer, decimal] = num.split('.');
  const parsed = parseFloat(integer);

  const intDisplay = Number.isNaN(parsed)
    ? integer === '-' ? '-' : ''
    : parsed.toLocaleString('en', {
        maximumFractionDigits: 0,
      });

  const sign = integer === '-0' ? '-' : '';

  return decimal != null
    ? `${sign}${intDisplay}.${decimal}`
    : `${sign}${intDisplay}`;
};

const calculate = (p, c, op) => {
  let result;

  if (op === '+') result = p + c;
  else if (op === '-') result = p - c;
  else if (op === '*') result = p * c;
  else if (op === '/') {
    if (c === 0) return null;
    result = p / c;
  } else {
    return null;
  }

  if (!Number.isFinite(result)) return null;

  return Math.round((result + Number.EPSILON) * 1e12) / 1e12;
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
      : (
          (parseFloat(calc.current) / RATES[fromCur]) *
          RATES[toCur]
        ).toLocaleString('en', {
          maximumFractionDigits: 2,
        });

  const addHistory = (expression, result) => {
    setHistory((items) =>
      [{ expression, result: String(result) }, ...items].slice(0, 20)
    );
  };

  const clear = () => setCalc(INITIAL);

  const del = () => {
    setCalc((prev) => {
      if (prev.resetScreen || prev.current === 'Error') {
        return {
          ...prev,
          current: '0',
          resetScreen: false,
        };
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

      if (prev.current.replace(/[-.]/g, '').length >= 15) {
        return prev;
      }

      return { ...prev, current: prev.current + num };
    });
  };

  const chooseOp = (op) => {
    if (calc.current === 'Error') return;

    if (calc.previous !== '' && !calc.resetScreen) {
      const p = parseFloat(calc.previous);
      const c = parseFloat(calc.current);
      const result = calculate(p, c, calc.operation);

      if (result === null) {
        setCalc({
          ...INITIAL,
          current: 'Error',
          resetScreen: true,
        });
        return;
      }

      addHistory(
        `${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`,
        result
      );

      setCalc({
        current: String(result),
        previous: String(result),
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
    const result = calculate(p, c, calc.operation);

    if (result === null) {
      setCalc({
        ...INITIAL,
        current: 'Error',
        resetScreen: true,
      });
      return;
    }

    addHistory(
      `${formatDisplay(calc.previous)} ${SYMBOLS[calc.operation]} ${formatDisplay(calc.current)}`,
      result
    );

    setCalc({
      current: String(result),
      previous: '',
      operation: null,
      resetScreen: true,
    });
  };

  const percent = () => {
    if (calc.current === 'Error') return;

    setCalc({
      ...calc,
      current: String(parseFloat(calc.current) / 100),
      resetScreen: false,
    });
  };

  const toggleSign = () => {
    if (calc.current === 'Error' || calc.current === '0') return;

    setCalc({
      ...calc,
      current: String(parseFloat(calc.current) * -1),
    });
  };

  const unary = (type) => {
    if (calc.current === 'Error') return;

    const x = parseFloat(calc.current);
    let result;
    let label;

    if (type === 'sqrt') {
      if (x < 0) {
        setCalc({ ...INITIAL, current: 'Error', resetScreen: true });
        return;
      }

      result = Math.sqrt(x);
      label = `√(${formatDisplay(calc.current)})`;
    }

    if (type === 'square') {
      result = x * x;
      label = `(${formatDisplay(calc.current)})²`;
    }

    if (type === 'inverse') {
      if (x === 0) {
        setCalc({ ...INITIAL, current: 'Error', resetScreen: true });
        return;
      }

      result = 1 / x;
      label = `1/(${formatDisplay(calc.current)})`;
    }

    result = Math.round((result + Number.EPSILON) * 1e12) / 1e12;

    addHistory(label, result);

    setCalc({
      ...calc,
      current: String(result),
      resetScreen: true,
    });
  };

  const ans = () => {
    if (history.length === 0) return;

    setCalc({
      ...calc,
      current: history[0].result,
      resetScreen: false,
    });
  };

  const memClear = () => setMemory(0);

  const memRecall = () => {
    setCalc({
      ...calc,
      current: String(memory),
      resetScreen: true,
    });
  };

  const memAdd = (sign) => {
    if (calc.current === 'Error') return;

    const value = parseFloat(calc.current);

    setMemory((m) =>
      Math.round((m + sign * value) * 1e12) / 1e12
    );

    setCalc({ ...calc, resetScreen: true });
  };

  const copyResult = async () => {
    if (calc.current === 'Error') return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(calc.current);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      setCopied(false);
    }
  };

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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        body {
          margin: 0;
          background: var(--bg, #08090D);
        }

        button, select {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse at 12% 8%, color-mix(in srgb, var(--eq) 22%, transparent), transparent 34%),
            radial-gradient(ellipse at 88% 92%, color-mix(in srgb, var(--op) 16%, transparent), transparent 38%),
            var(--bg);
          transition: background 0.4s ease;
          padding: 32px 18px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .calculator {
          width: 100%;
          max-width: 390px;
          background: linear-gradient(160deg, color-mix(in srgb, var(--card) 96%, white 4%), color-mix(in srgb, var(--card) 90%, black 10%));
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 30px;
          padding: 25px;
          box-shadow:
            0 30px 90px rgba(0,0,0,0.48),
            0 0 0 1px rgba(255,70,85,0.05),
            inset 0 1px 0 rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          transition: background 0.4s ease, transform 0.25s ease;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .brand {
          color: var(--text);
          font-size: 0.92rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .brand small {
          display: block;
          color: var(--sub);
          font-weight: 500;
          font-size: 0.72rem;
          letter-spacing: 0.03em;
          margin-top: 5px;
          text-transform: none;
        }

        .top-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .chip {
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.74rem;
          font-weight: 650;
          cursor: pointer;
          background: var(--display);
          color: var(--text);
          transition: all 0.2s ease;
        }

        .chip:hover {
          filter: brightness(1.2);
          border-color: var(--eq);
        }

        .display {
          background: linear-gradient(145deg, var(--display), color-mix(in srgb, var(--display) 75%, var(--eq)));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 22px 18px;
          text-align: right;
          margin-bottom: 20px;
          min-height: 128px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          word-break: break-all;
          box-shadow: inset 0 4px 16px rgba(0,0,0,0.22);
        }

        .previous-operand {
          color: var(--sub);
          font-size: 0.9rem;
          min-height: 20px;
        }

        .current-operand {
          color: var(--text);
          font-size: clamp(2rem, 8vw, 2.55rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.045em;
          font-variant-numeric: tabular-nums;
        }

        .keypad {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .btn {
          min-width: 0;
          height: 58px;
          font-size: 1.12rem;
          font-weight: 700;
          border-radius: 17px;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
        }

        .btn:active {
          transform: scale(0.94);
        }

        .btn:focus-visible, .chip:focus-visible {
          outline: 2px solid var(--eq);
          outline-offset: 3px;
        }

        .btn-num {
          background: linear-gradient(145deg, color-mix(in srgb, var(--num) 76%, var(--display)), var(--num));
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.075);
          box-shadow: 0 5px 12px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .btn-num:hover {
          filter: brightness(1.2);
          border-color: color-mix(in srgb, var(--eq) 50%, transparent);
        }

        .btn-fn {
          background: linear-gradient(145deg, color-mix(in srgb, var(--fn) 85%, #fff), var(--fn));
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          font-size: 0.92rem;
          font-weight: 750;
        }

        .btn-fn:hover {
          filter: brightness(1.15);
        }

        .btn-sci {
          background: linear-gradient(145deg, color-mix(in srgb, var(--display) 90%, #fff), var(--display));
          color: var(--sub);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 0.92rem;
          font-weight: 650;
        }

        .btn-sci:hover {
          color: var(--text);
          border-color: rgba(255,255,255,0.2);
        }

        .btn-mem {
          height: 40px;
          background: transparent;
          color: var(--eq);
          border: 1px solid color-mix(in srgb, var(--eq) 45%, transparent);
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 750;
          letter-spacing: 0.02em;
        }

        .btn-mem:hover {
          background: color-mix(in srgb, var(--eq) 14%, transparent);
        }

        .btn-op {
          background: linear-gradient(145deg, color-mix(in srgb, var(--op) 24%, var(--display)), var(--display));
          color: var(--op);
          border: 1px solid color-mix(in srgb, var(--op) 55%, transparent);
          font-size: 1.35rem;
          font-weight: 850;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--op) 12%, transparent);
        }

        .btn-op:hover {
          filter: brightness(1.2);
          box-shadow: 0 5px 18px color-mix(in srgb, var(--op) 25%, transparent);
        }

        .btn-eq {
          background: linear-gradient(145deg, var(--eq), color-mix(in srgb, var(--eq) 70%, #000));
          color: #fff;
          border: 1px solid var(--eq);
          font-size: 1.4rem;
          font-weight: 900;
          box-shadow: 0 6px 20px color-mix(in srgb, var(--eq) 35%, transparent);
        }

        .btn-eq:hover {
          filter: brightness(1.12);
        }

        .history {
          width: 100%;
          max-width: 320px;
          background: color-mix(in srgb, var(--card) 94%, transparent);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 20px;
          max-height: 520px;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.32);
          backdrop-filter: blur(18px);
        }

        .history h3 {
          color: var(--text);
          font-size: 0.95rem;
          margin-bottom: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-item {
          background: var(--display);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 9px;
          text-align: right;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .history-item:hover {
          border-color: var(--eq);
        }

        .history-item .expr {
          color: var(--sub);
          font-size: 0.8rem;
          overflow-wrap: anywhere;
        }

        .history-item .res {
          color: var(--text);
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 4px;
        }

        .empty {
          color: var(--sub);
          font-size: 0.85rem;
          text-align: center;
          padding: 20px 0;
        }

        .signature {
          color: var(--sub);
          font-size: 0.68rem;
          text-align: center;
          margin-top: 20px;
          letter-spacing: 0.14em;
          font-weight: 700;
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
          background: rgba(255,255,255,0.12);
        }

        .conv-amount {
          flex: 1;
          min-width: 0;
          color: var(--text);
          font-size: 1.55rem;
          font-weight: 750;
          text-align: right;
          word-break: break-all;
        }

        .converter-display select {
          background: var(--card);
          color: var(--text);
          border: 1px solid color-mix(in srgb, var(--op) 45%, transparent);
          border-radius: 10px;
          padding: 8px;
          font-size: 0.85rem;
          outline: none;
          max-width: 110px;
        }

        .btn-conv {
          grid-column: 1 / -1;
          height: 48px;
          background: linear-gradient(145deg, color-mix(in srgb, var(--display) 90%, #fff), var(--display));
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .btn-conv.active {
          background: linear-gradient(145deg, var(--eq), color-mix(in srgb, var(--eq) 70%, #000));
          color: #fff;
          border-color: var(--eq);
        }

        @media (max-width: 420px) {
          .calculator {
            padding: 18px;
            border-radius: 25px;
          }

          .btn {
            height: 52px;
            border-radius: 14px;
          }

          .page {
            align-items: flex-start;
            padding: 14px 10px 30px;
          }

          .display {
            min-height: 108px;
            margin-bottom: 15px;
          }

          .btn-mem {
            height: 36px;
          }

          .keypad {
            gap: 8px;
          }
        }
      `}</style>

      <div className="page" style={cssVars}>
        <div className="calculator">
          <div className="topbar">
            <div className="brand">
              AimS Calculator
              <small>Precision meets simplicity</small>
            </div>

            <div className="top-actions">
              <button
                className="chip"
                onClick={() =>
                  setThemeIndex((index) => (index + 1) % THEMES.length)
                }
                title="Change theme"
              >
                 {t.name}
              </button>

              <button
                className="chip"
                onClick={() => setShowHistory((visible) => !visible)}
              >
                 History
              </button>
            </div>
          </div>

          {!convertMode && (
            <div
              className="display"
              onClick={copyResult}
              title="Click to copy result"
              style={{ cursor: 'pointer' }}
            >
              <div className="previous-operand">
                {copied
                  ? '✓ Copied!'
                  : `${memory !== 0 ? 'M  ' : ''}${calc.previous ? formatDisplay(calc.previous) : ''} ${
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
                <select
                  value={fromCur}
                  onChange={(e) => setFromCur(e.target.value)}
                  aria-label="Convert from currency"
                >
                  {Object.keys(RATES).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <div className="conv-amount">
                  {formatDisplay(calc.current)}
                </div>
              </div>

              <div className="conv-divider" />

              <div className="conv-row">
                <select
                  value={toCur}
                  onChange={(e) => setToCur(e.target.value)}
                  aria-label="Convert to currency"
                >
                  {Object.keys(RATES).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <div className="conv-amount">{converted}</div>
              </div>
            </div>
          )}

          <div className="keypad">
            <button className="btn btn-mem" onClick={memClear}>MC</button>
            <button className="btn btn-mem" onClick={memRecall}>MR</button>
            <button className="btn btn-mem" onClick={() => memAdd(1)}>M+</button>
            <button className="btn btn-mem" onClick={() => memAdd(-1)}>M−</button>

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

            <button
              className={`btn btn-conv ${convertMode ? 'active' : ''}`}
              onClick={() => setConvertMode((mode) => !mode)}
            >
              {convertMode ? '← Calculator' : '⇄ Convert Currency'}
            </button>
          </div>

          <div className="signature">
            AIMS • CALCULATOR STUDIO
          </div>
        </div>

        {showHistory && (
          <div className="history">
            <h3>
              History
              <button
                className="chip"
                onClick={() => setHistory([])}
              >
                Clear
              </button>
            </h3>

            {history.length === 0 ? (
              <div className="empty">No calculations yet</div>
            ) : (
              history.map((item, index) => (
                <div
                  key={`${item.expression}-${index}`}
                  className="history-item"
                  onClick={() =>
                    setCalc({
                      ...INITIAL,
                      current: item.result,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCalc({ ...INITIAL, current: item.result });
                    }
                  }}
                >
                  <div className="expr">{item.expression} =</div>
                  <div className="res">
                    {formatDisplay(item.result)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
