import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';

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
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');

  // Handle number presses
  const handleNumber = (num) => {
    if (displayValue === '0') {
      setDisplayValue(num);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

<<<<<<< HEAD
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
=======
  // Handle operator presses (+, -, *, /)
  const handleOperator = (op) => {
    setOperator(op);
    setFirstValue(displayValue);
    setDisplayValue('0');
  };

  // Calculate the final answer
  const handleEqual = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);

    if (isNaN(num1) || isNaN(num2) || !operator) return;

    let result = 0;
    if (operator === '+') result = num1 + num2;
    if (operator === '-') result = num1 - num2;
    if (operator === '×') result = num1 * num2;
    if (operator === '÷') {
      if (num2 === 0) {
        setDisplayValue('Error');
        setOperator(null);
        setFirstValue('');
        return;
      }
      result = num1 / num2;
    }

    setDisplayValue(String(result));
    setOperator(null);
    setFirstValue('');
  };

  // Clear everything
  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Screen Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.subText}>
          {firstValue} {operator}
        </Text>
        <Text style={styles.displayText} numberOfLines={1}>
          {displayValue}
        </Text>
      </View>

      {/* Keypad Grid */}
      <View style={styles.keypad}>
        {/* Row 1 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={handleClear}>
            <Text style={styles.clearBtnText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOperator('÷')}>
            <Text style={styles.opBtnText}>÷</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('7')}>
            <Text style={styles.btnText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('8')}>
            <Text style={styles.btnText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('9')}>
            <Text style={styles.btnText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOperator('×')}>
            <Text style={styles.opBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('4')}>
            <Text style={styles.btnText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('5')}>
            <Text style={styles.btnText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('6')}>
            <Text style={styles.btnText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOperator('-')}>
            <Text style={styles.opBtnText}>-</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('1')}>
            <Text style={styles.btnText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('2')}>
            <Text style={styles.btnText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('3')}>
            <Text style={styles.btnText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.opBtn]} onPress={() => handleOperator('+')}>
            <Text style={styles.opBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.zeroBtn]} onPress={() => handleNumber('0')}>
            <Text style={styles.btnText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => handleNumber('.')}>
            <Text style={styles.btnText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.equalBtn]} onPress={handleEqual}>
            <Text style={styles.equalBtnText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
>>>>>>> 48ce54c72c1e0fb4839cd68b5ab7d2a09cd27ac4
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17181A',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  subText: {
    fontSize: 24,
    color: '#71757A',
    marginBottom: 5,
  },
  displayText: {
    fontSize: 56,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  keypad: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#2E2F38',
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '500',
  },
  zeroBtn: {
    width: 156,
    alignItems: 'center',
  },
  opBtn: {
    backgroundColor: '#4B5EFC',
  },
  opBtnText: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  clearBtn: {
    backgroundColor: '#A5A5A5',
    width: 240,
  },
  clearBtnText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  equalBtn: {
    backgroundColor: '#4B5EFC',
  },
  equalBtnText: {
    color: '#FFFFFF',
    fontSize: 28,
  },
});