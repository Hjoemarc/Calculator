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
  ['AC', 'DEL', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

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

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleNumber = (num) => {
    if (displayValue === 'Error' || justEvaluated) {
      setDisplayValue(num === '.' ? '0.' : num);
      setJustEvaluated(false);
      return;
    }
    if (num === '.') {
      if (!displayValue.includes('.')) setDisplayValue(displayValue + '.');
      return;
    }
    setDisplayValue(displayValue === '0' ? num : displayValue + num);
  };

  const handleOperator = (op) => {
    if (displayValue === 'Error') return;
    // chain operations: 2 + 3 + ... evaluates 2 + 3 first
    if (operator && firstValue !== '' && !justEvaluated && displayValue !== '0') {
      const r = compute(parseFloat(firstValue), parseFloat(displayValue), operator);
      if (r === null) return showError();
      setFirstValue(format(r));
    } else {
      setFirstValue(displayValue);
    }
    setOperator(op);
    setDisplayValue('0');
    setJustEvaluated(false);
  };

  const showError = () => {
    setDisplayValue('Error');
    setOperator(null);
    setFirstValue('');
  };

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

  return (
    <SafeAreaView style={styles.stage}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFBCB4" />

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'flex-end',
    borderTopWidth: 3,
    borderTopColor: '#8E9880',
  },
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
});