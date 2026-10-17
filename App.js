import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const ROWS = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];
const OPS = ['÷', '×', '-', '+'];

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');

  const handleNumber = (num) => {
    if (displayValue === 'Error') {
      setDisplayValue(num === '.' ? '0.' : num);
      return;
    }
    if (num === '.') {
      if (displayValue.includes('.')) return;
      setDisplayValue(displayValue + '.');
      return;
    }
    setDisplayValue(displayValue === '0' ? num : displayValue + num);
  };

  const handleOperator = (op) => {
    if (displayValue === 'Error') return;
    setOperator(op);
    setFirstValue(displayValue);
    setDisplayValue('0');
  };

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
    setOperator(null);
    setFirstValue('');
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'flex-end' },
  displayContainer: {
    padding: 24,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
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
});