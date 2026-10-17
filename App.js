import React, { useState } from 'react';

const KEYS = [
  'AC', 'DEL', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '−',
  '1', '2', '3', '+',
  '0', '.', '=',
];

const OPS = { '÷': '/', '×': '*', '−': '-', '+': '+' };

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
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#08090D', fontFamily: 'sans-serif' }}>
      <div style={{ width: 320, padding: 20, borderRadius: 24, background: '#151720' }}>
        <div style={{ padding: 16, marginBottom: 16, borderRadius: 16, background: '#0B0D12', color: '#F8FAFC', textAlign: 'right' }}>
          <div style={{ minHeight: 20, color: '#9CA3AF' }}>{expr}</div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{result}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {KEYS.map((key) => (
            <button
              key={key}
              onClick={() => press(key)}
              style={{
                height: 56,
                gridColumn: key === '=' ? 'span 2' : undefined,
                border: 'none',
                borderRadius: 14,
                fontSize: 20,
                cursor: 'pointer',
                color: '#fff',
                background: key in OPS || key === '=' ? '#FF4655' : '#20232D',
              }}
            >
              {key}
            </button>
          ))}
        </div>
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
=======
}
>>>>>>> e8808dee3910ee9d3a4b9a579984883d6247d4ec
