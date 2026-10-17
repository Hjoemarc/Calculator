import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';

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