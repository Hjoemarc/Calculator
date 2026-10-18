import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const ROWS = [
<<<<<<< HEAD
  ['AC', 'DEL', '%', '÷'],
=======
  ['C', '⌫', '%', '÷'],
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];
<<<<<<< HEAD

const OPS = ['+', '-', '×', '÷'];

const kindOf = (key) => {
  if (key === 'AC') return 'clear';
  if (key === '=') return 'equals';
  if (OPS.includes(key)) return 'op';
  if (key === 'DEL' || key === '%') return 'fn';
  return 'num';
};

const PALETTE = {
  num: { face: '#F3F1EB', edge: '#B3B0A6', ink: '#25241F' },
  fn: { face: '#A8A69E', edge: '#7C7A72', ink: '#25241F' },
  op: { face: '#3B3A36', edge: '#1B1A18', ink: '#F3F1EB' },
  clear: { face: '#E4572E', edge: '#A63A19', ink: '#FFF6EE' },
  equals: { face: '#F2B705', edge: '#B08500', ink: '#25241F' },
};

const compute = (a, b, op) => {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') return b === 0 ? null : a / b;
  return b;
};

const format = (n) => String(parseFloat(n.toPrecision(12)));
=======
const OPS = ['÷', '×', '-', '+'];
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleNumber = (num) => {
<<<<<<< HEAD
    if (displayValue === 'Error' || justEvaluated) {
      setDisplayValue(num === '.' ? '0.' : num);
      setJustEvaluated(false);
      return;
    }
    if (num === '.') {
      if (!displayValue.includes('.')) setDisplayValue(displayValue + '.');
=======
    if (displayValue === 'Error') {
      setDisplayValue(num === '.' ? '0.' : num);
      return;
    }
    if (num === '.') {
      if (displayValue.includes('.')) return;
      setDisplayValue(displayValue + '.');
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
      return;
    }
    setDisplayValue(displayValue === '0' ? num : displayValue + num);
  };

  const handleOperator = (op) => {
    if (displayValue === 'Error') return;
<<<<<<< HEAD
    // chain operations: 2 + 3 + ... evaluates 2 + 3 first
    if (operator && firstValue !== '' && !justEvaluated && displayValue !== '0') {
      const r = compute(parseFloat(firstValue), parseFloat(displayValue), operator);
      if (r === null) return showError();
      setFirstValue(format(r));
    } else {
      setFirstValue(displayValue);
    }
=======
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
    setOperator(op);
    setDisplayValue('0');
    setJustEvaluated(false);
  };

<<<<<<< HEAD
  const showError = () => {
    setDisplayValue('Error');
=======
  const handleEqual = () => {
    const a = parseFloat(firstValue);
    const b = parseFloat(displayValue);
    if (isNaN(a) || isNaN(b) || !operator) return;

    let result = 0;
    if (operator === '+') result = a + b;
    if (operator === '-') result = a - b;
    if (operator === '×') result = a * b;
    if (operator === '÷') {
      if (b === 0) {
        setDisplayValue('Error');
        setOperator(null);
        setFirstValue('');
        return;
      }
      result = a / b;
    }
    setDisplayValue(String(parseFloat(result.toFixed(10))));
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
    setOperator(null);
    setFirstValue('');
  };

<<<<<<< HEAD
  const handleEqual = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);
    if (isNaN(num1) || isNaN(num2) || !operator) return;
    const r = compute(num1, num2, operator);
    if (r === null) return showError();
    setDisplayValue(format(r));
    setOperator(null);
    setFirstValue('');
    setJustEvaluated(true);
  };

=======
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
    setJustEvaluated(false);
  };

  const handleDelete = () => {
    if (displayValue === 'Error' || justEvaluated) return handleClear();
    setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0');
  };

  const handlePercent = () => {
    if (displayValue === 'Error') return;
    setDisplayValue(format(parseFloat(displayValue) / 100));
  };

  const press = (key) => {
    if (key === 'AC') return handleClear();
    if (key === 'DEL') return handleDelete();
    if (key === '%') return handlePercent();
    if (key === '=') return handleEqual();
    if (OPS.includes(key)) return handleOperator(key);
    return handleNumber(key);
  };

  const renderKey = (key) => {
    const kind = kindOf(key);
    const c = PALETTE[kind];
    return (
      <Pressable
        key={key}
        onPress={() => press(key)}
        accessibilityRole="button"
        accessibilityLabel={key}
        style={({ pressed }) => [
          styles.key,
          kind === 'equals' && styles.keyWide,
          {
            backgroundColor: c.face,
            borderBottomColor: c.edge,
            borderBottomWidth: pressed ? 1 : 5,
            marginTop: pressed ? 4 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.keyText,
            { color: c.ink },
            kind === 'clear' && { fontSize: 18 },
            kind === 'op' && { fontSize: 24 },
            kind === 'equals' && { fontSize: 26 },
          ]}
        >
          {key}
        </Text>
      </Pressable>
    );
  };

  const handleDelete = () => {
    if (displayValue === 'Error' || displayValue.length <= 1) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  const handlePercent = () => {
    if (displayValue === 'Error') return;
    setDisplayValue(String(parseFloat(displayValue) / 100));
  };

  const handlePress = (key) => {
    if (key === 'C') return handleClear();
    if (key === '⌫') return handleDelete();
    if (key === '%') return handlePercent();
    if (key === '=') return handleEqual();
    if (OPS.includes(key)) return handleOperator(key);
    return handleNumber(key);
  };

  const getStyle = (key) => {
    if (key === 'C') return styles.clearBtn;
    if (key === '⌫' || key === '%') return styles.fnBtn;
    if (key === '=') return styles.equalBtn;
    if (OPS.includes(key)) return styles.opBtn;
    if (key === '0') return styles.zeroBtn;
    return null;
  };

  return (
    <SafeAreaView style={styles.stage}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFBCB4" />

<<<<<<< HEAD
      <View style={styles.body}>
        {/* LCD display */}
        <View style={styles.display}>
          <Text style={styles.expr} numberOfLines={1}>
            {firstValue ? `${firstValue} ${operator || ''}` : ' '}
          </Text>
          <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
            {displayValue}
          </Text>
        </View>

        {/* Keypad */}
        <View>
          {ROWS.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map(renderKey)}
            </View>
          ))}
        </View>
=======
      <View style={styles.displayContainer}>
        <Text style={styles.subText}>
          {firstValue} {operator}
        </Text>
   <Text style={styles.displayText} numberOfLines={1}>          {displayValue}
        </Text>
      </View>

      <View style={styles.keypad}>
        {ROWS.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.btn, getStyle(key)]}
                onPress={() => handlePress(key)}
              >
                <Text style={styles.btnText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  stage: {
    flex: 1,
    backgroundColor: '#BFBCB4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  body: {
    width: '100%',
    maxWidth: 340,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderRadius: 14,
    backgroundColor: '#DAD8D1',
    borderBottomWidth: 4,
    borderBottomColor: '#A9A69D',
    elevation: 10,
    shadowColor: '#28241C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  display: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 22,
    borderRadius: 6,
    backgroundColor: '#B7C1A6',
=======
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'flex-end' },
  displayContainer: {
    padding: 24,
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
    alignItems: 'flex-end',
    borderTopWidth: 3,
    borderTopColor: '#8E9880',
  },
<<<<<<< HEAD
  expr: {
    minHeight: 22,
    fontSize: 15,
    letterSpacing: 0.6,
    color: '#4C5744',
  },
  result: {
    marginTop: 2,
    fontSize: 44,
    fontWeight: '300',
    color: '#1D2319',
    width: '100%',
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  key: {
    flex: 1,
    height: 58,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyWide: {
    flex: 2,
  },
  keyText: {
    fontSize: 21,
    fontWeight: '500',
  },
=======
  subText: { fontSize: 24, color: '#2DD4BF', marginBottom: 6 },
  displayText: { fontSize: 64, color: '#F8FAFC', fontWeight: '300' },
  keypad: { padding: 12 },
  row: { flexDirection: 'row', marginBottom: 4 },
  btn: {
    flex: 1,
    height: 72,
    margin: 6,
    borderRadius: 36,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#F8FAFC', fontSize: 28, fontWeight: '500' },
  zeroBtn: { flex: 2 },
  opBtn: { backgroundColor: '#8B5CF6' },
  fnBtn: { backgroundColor: '#334155' },
  clearBtn: { backgroundColor: '#F43F5E' },
  equalBtn: { backgroundColor: '#14B8A6' },
>>>>>>> 00eeebba7c3564391b987a7839df251d2509fb91
});