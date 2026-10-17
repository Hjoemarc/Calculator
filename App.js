
import React, { useState } from 'react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);

  const press = (value) => {
    if (value === 'AC') return setDisplay('0');
    if (value === 'DEL') return setDisplay(display.slice(0, -1) || '0');
    if (value === '%') return setDisplay(String(Number(display) / 100));

    if (value === '=') {
      try {
        if (!/^[0-9+\-*/.() ]+$/.test(display)) throw Error();
        const result = Function(`"use strict"; return (${display})`)();
        if (!Number.isFinite(result)) throw Error();
        setHistory([`${display} = ${result}`, ...history]);
        setDisplay(String(result));
      } catch {
        setDisplay('Error');
      }
      return;
    }

    setDisplay(display === '0' || display === 'Error'
      ? value : display + value);
  };

  const buttons = [
    'AC', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '(', ')', '='
  ];

  return (
    <div style={styles.page}>
      <div style={styles.calculator}>
        <h2>My Calculator</h2>
        <div style={styles.display}>{display}</div>

        <div style={styles.grid}>
          {buttons.map((b) => (
            <button key={b} onClick={() => press(b)}
              style={{
                ...styles.button,
                background: ['AC', 'DEL', '%'].includes(b)
                  ? '#475569'
                  : ['+', '-', '*', '/', '='].includes(b)
                  ? '#06b6d4' : '#1e293b'
              }}>
              {b}
            </button>
          ))}
        </div>

        <h3>History</h3>
        {history.slice(0, 5).map((item, i) => (
          <p key={i}>{item}</p>
        ))}
        <button onClick={() => setHistory([])}>Clear History</button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0f172a', color: 'white',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontFamily: 'Arial', padding: 20
  },
  calculator: {
    background: 'hsl(11, 65%, 52%)', padding: 25, borderRadius: 20,
    width: 300, textAlign: 'center'
  },
  display: {
    background: '#020617', padding: 20, marginBottom: 15,
    fontSize: 28, textAlign: 'right', overflowWrap: 'anywhere'
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8
  },
  button: {
    padding: 15, border: 'none', borderRadius: 8,
    color: 'white', fontSize: 18, cursor: 'pointer'
  }
};
