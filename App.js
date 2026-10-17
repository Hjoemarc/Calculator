import React, { useState, useEffect } from 'react';

// Modified by June Mark C. Undik
// New design: Gradient background, glass effect, color themes, calculation history, scientific buttons, and interactive button style switcher.

const THEMES = [
  { name: 'Midnight', bg: '#11369c', card: '#1e1b4b', display: '#0b0f1a', num: '#4338ca', fn: '#5b21b6', op: '#ec4899', opGlow: 'rgba(236, 72, 153, 0.65)', eq: '#06b6d4', eqGlow: 'rgba(6, 182, 212, 0.7)', text: '#f8fafc', sub: '#94a3b8' },
  { name: 'Ocean', bg: '#031c2b', card: '#0c4a6e', display: '#06283d', num: '#0369a1', fn: '#0e7490', op: '#f59e0b', opGlow: 'rgba(245, 158, 11, 0.65)', eq: '#10b981', eqGlow: 'rgba(16, 185, 129, 0.7)', text: '#f0f9ff', sub: '#7dd3fc' },
  { name: 'Sunset', bg: '#e13a9ec1', card: '#7c2d12', display: '#3b0d1f', num: '#9a3412', fn: '#be123c', op: '#facc15', opGlow: 'rgba(250, 204, 21, 0.7)', eq: '#fb7185', eqGlow: 'rgba(251, 113, 133, 0.7)', text: '#fff7ed', sub: '#fdba74' },
  { name: 'Light', bg: '#e2e8f0', card: '#ffffff', display: '#f1f5f9', num: '#cbd5e1', fn: '#94a3b8', op: '#6366f1', opGlow: 'rgba(99, 102, 241, 0.6)', eq: '#10b981', eqGlow: 'rgba(16, 185, 129, 0.6)', text: '#0f172a', sub: '#64748b' },
];

const BUTTON_STYLES = [
  { id: 'style-cyberpunk', name: '1) Cyberpunk Neon' },
  { id: 'style-3d-mechanical', name: '2) 3D Mechanical' },
  { id: 'style-glassmorphism', name: '3) Glassmorphism Glow' },
  { id: 'style-glossy-pill', name: '4) Glossy Pill Bubbles' }
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
  const [btnStyleIndex, setBtnStyleIndex] = useState(0);
  const [convertMode, setConvertMode] = useState(false);
  const [fromCur, setFromCur] = useState('Peso');
  const [toCur, setToCur] = useState('USD');

  const t = THEMES[themeIndex];
  const activeStyle = BUTTON_STYLES[btnStyleIndex];

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

  const ans = () => {
    if (history.length === 0) return;

    setCalc({
      ...calc,
      current: history[0].result,
      resetScreen: false,
    });
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
    '--opGlow': t.opGlow,
    '--eq': t.eq,
    '--eqGlow': t.eqGlow,
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
          margin-bottom: 12px;
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
          margin-top: 3px;
        }

        .top-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .chip {
          white-space: nowrap;
          border: none;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          background: var(--display);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .chip:hover {
          filter: brightness(1.2);
          transform: translateY(-1px);
        }

        .style-switcher-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.15);
          padding: 6px 12px;
          border-radius: 12px;
          margin-bottom: 14px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .style-switcher-bar span {
          color: var(--sub);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .style-btn {
          background: var(--eq);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px color-mix(in srgb, var(--eq) 30%, transparent);
          transition: transform 0.15s ease;
        }

        .style-btn:hover {
          transform: scale(1.04);
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
          margin-bottom: 18px;
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
          gap: 10px;
        }

        .btn {
          height: 56px;
          font-size: 1.2rem;
          font-weight: 650;
          cursor: pointer;
          user-select: none;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Common Utility Styles */
        .btn-fn {
          background: linear-gradient(145deg, var(--fn), color-mix(in srgb, var(--fn) 75%, #ffffff));
          color: var(--text);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .btn-sci {
          background: var(--display);
          color: var(--text);
          font-size: 1rem;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* ========================================================
           1) CYBERPUNK NEON GLOW STYLE
           ======================================================== */
        .style-cyberpunk .btn-num {
          background: color-mix(in srgb, var(--display) 92%, black);
          color: var(--text);
          border-radius: 12px;
          border: 1.5px solid color-mix(in srgb, var(--eq) 50%, transparent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--eq) 20%, transparent);
          font-weight: 700;
        }
        .style-cyberpunk .btn-num:hover {
          border-color: var(--eq);
          box-shadow: 0 0 16px color-mix(in srgb, var(--eq) 60%, transparent);
          filter: brightness(1.2);
        }

        .style-cyberpunk .btn-op {
          background: color-mix(in srgb, var(--display) 85%, black);
          color: var(--op);
          border-radius: 12px;
          border: 1.5px solid var(--op);
          box-shadow: 0 0 12px var(--opGlow);
          font-weight: 800;
          font-size: 1.45rem;
        }
        .style-cyberpunk .btn-op:hover {
          background: var(--op);
          color: #ffffff;
          box-shadow: 0 0 22px var(--opGlow);
        }

        .style-cyberpunk .btn-eq {
          background: var(--eq);
          color: #ffffff;
          border-radius: 12px;
          border: 1.5px solid #ffffff;
          box-shadow: 0 0 18px var(--eqGlow);
          font-weight: 800;
          font-size: 1.5rem;
        }
        .style-cyberpunk .btn-eq:hover {
          box-shadow: 0 0 28px var(--eqGlow);
          filter: brightness(1.2);
        }

        /* ========================================================
           2) 3D CHUNKY MECHANICAL KEYS STYLE
           ======================================================== */
        .style-3d-mechanical .btn {
          border-radius: 14px;
        }
        .style-3d-mechanical .btn-num {
          background: linear-gradient(180deg, color-mix(in srgb, var(--num) 90%, white), var(--num));
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 6px 0 color-mix(in srgb, var(--num) 50%, black), 0 8px 12px rgba(0,0,0,0.3);
          font-weight: 700;
        }
        .style-3d-mechanical .btn-num:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 0 color-mix(in srgb, var(--num) 50%, black), 0 10px 14px rgba(0,0,0,0.35);
        }
        .style-3d-mechanical .btn-num:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 color-mix(in srgb, var(--num) 50%, black), 0 3px 6px rgba(0,0,0,0.2);
        }

        .style-3d-mechanical .btn-op {
          background: linear-gradient(180deg, color-mix(in srgb, var(--op) 90%, white), var(--op));
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 6px 0 color-mix(in srgb, var(--op) 45%, black), 0 8px 14px var(--opGlow);
          font-size: 1.5rem;
          font-weight: 800;
        }
        .style-3d-mechanical .btn-op:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 0 color-mix(in srgb, var(--op) 45%, black), 0 12px 18px var(--opGlow);
        }
        .style-3d-mechanical .btn-op:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 color-mix(in srgb, var(--op) 45%, black);
        }

        .style-3d-mechanical .btn-eq {
          background: linear-gradient(180deg, color-mix(in srgb, var(--eq) 90%, white), var(--eq));
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 6px 0 color-mix(in srgb, var(--eq) 45%, black), 0 8px 16px var(--eqGlow);
          font-size: 1.5rem;
          font-weight: 800;
        }
        .style-3d-mechanical .btn-eq:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 0 color-mix(in srgb, var(--eq) 45%, black), 0 12px 20px var(--eqGlow);
        }
        .style-3d-mechanical .btn-eq:active {
          transform: translateY(4px);
          box-shadow: 0 2px 0 color-mix(in srgb, var(--eq) 45%, black);
        }

        /* ========================================================
           3) GLASSMORPHISM GLOW STYLE
           ======================================================== */
        .style-glassmorphism .btn {
          border-radius: 18px;
          backdrop-filter: blur(12px);
        }
        .style-glassmorphism .btn-num {
          background: color-mix(in srgb, var(--num) 30%, transparent);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 20px rgba(0,0,0,0.15);
          font-weight: 700;
        }
        .style-glassmorphism .btn-num:hover {
          background: color-mix(in srgb, var(--num) 50%, transparent);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 15px color-mix(in srgb, var(--num) 40%, transparent);
        }

        .style-glassmorphism .btn-op {
          background: color-mix(in srgb, var(--op) 35%, transparent);
          color: #ffffff;
          border: 1.5px solid color-mix(in srgb, var(--op) 70%, white);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), 0 8px 20px var(--opGlow);
          font-size: 1.5rem;
          font-weight: 800;
        }
        .style-glassmorphism .btn-op:hover {
          background: color-mix(in srgb, var(--op) 65%, transparent);
          box-shadow: 0 0 22px var(--opGlow);
          border-color: #ffffff;
        }

        .style-glassmorphism .btn-eq {
          background: color-mix(in srgb, var(--eq) 45%, transparent);
          color: #ffffff;
          border: 1.5px solid color-mix(in srgb, var(--eq) 80%, white);
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.7), 0 8px 24px var(--eqGlow);
          font-size: 1.5rem;
          font-weight: 800;
        }
        .style-glassmorphism .btn-eq:hover {
          background: color-mix(in srgb, var(--eq) 75%, transparent);
          box-shadow: 0 0 28px var(--eqGlow);
          border-color: #ffffff;
        }

        /* ========================================================
           4) PILL-CAP GLOSSY BUBBLES STYLE
           ======================================================== */
        .style-glossy-pill .btn {
          border-radius: 999px;
        }
        .style-glossy-pill .btn-num {
          background: radial-gradient(circle at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 60%),
                      linear-gradient(180deg, color-mix(in srgb, var(--num) 80%, white), var(--num));
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 6px 14px rgba(0,0,0,0.25), inset 0 -3px 4px rgba(0,0,0,0.2);
          font-weight: 700;
        }
        .style-glossy-pill .btn-num:hover {
          filter: brightness(1.15);
          transform: scale(1.04);
        }

        .style-glossy-pill .btn-op {
          background: radial-gradient(circle at 35% 25%, #ffffff 0%, transparent 65%),
                      linear-gradient(180deg, color-mix(in srgb, var(--op) 85%, white), var(--op));
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 18px var(--opGlow), inset 0 -3px 5px rgba(0,0,0,0.3);
          font-size: 1.55rem;
          font-weight: 800;
        }
        .style-glossy-pill .btn-op:hover {
          filter: brightness(1.2);
          transform: scale(1.06);
          box-shadow: 0 10px 24px var(--opGlow);
        }

        .style-glossy-pill .btn-eq {
          background: radial-gradient(circle at 35% 25%, #ffffff 0%, transparent 65%),
                      linear-gradient(180deg, color-mix(in srgb, var(--eq) 85%, white), var(--eq));
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 20px var(--eqGlow), inset 0 -3px 5px rgba(0,0,0,0.3);
          font-size: 1.55rem;
          font-weight: 800;
        }
        .style-glossy-pill .btn-eq:hover {
          filter: brightness(1.2);
          transform: scale(1.06);
          box-shadow: 0 10px 26px var(--eqGlow);
        }

        /* Common Press State */
        .btn:active {
          transform: scale(0.92) !important;
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
          font-size: 0.95rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
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
            height: 50px;
          }

          .page {
            align-items: flex-start;
            padding: 12px 12px 40px;
          }

          .display {
            min-height: 96px;
            margin-bottom: 14px;
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
        <div className={`calculator ${activeStyle.id}`}>
          <div className="topbar">
            <div className="brand">
              CALCULATOR
              <small>by June Mark C. Undik</small>
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

          <div className="style-switcher-bar">
            <span>Key Style:</span>
            <button
              className="style-btn"
              onClick={() => setBtnStyleIndex((btnStyleIndex + 1) % BUTTON_STYLES.length)}
            >
              ✨ {activeStyle.name}
            </button>
          </div>

          {!convertMode && (
            <div className="display">
              <div className="previous-operand">
                {formatDisplay(calc.previous)}{' '}
                {calc.operation && SYMBOLS[calc.operation]}
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

            <button 
              className="btn btn-op" 
              onClick={() => chooseOp('/')}
            >
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

            <button 
              className="btn btn-op" 
              onClick={() => chooseOp('*')}
            >
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

            <button 
              className="btn btn-op" 
              onClick={() => chooseOp('-')}
            >
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

            <button 
              className="btn btn-op" 
              onClick={() => chooseOp('+')}
            >
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