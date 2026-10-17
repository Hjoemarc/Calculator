import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';

export default function App() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState(null);

  // Simple calculation handler
  const calculate = (operator) => {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      alert('Please enter numbers in both fields!');
      return;
    }

    let res = 0;
    if (operator === '+') res = number1 + number2;
    if (operator === '-') res = number1 - number2;
    if (operator === '*') res = number1 * number2;
    if (operator === '/') {
      if (number2 === 0) {
        alert("Cannot divide by zero!");
        return;
      }
      res = number1 / number2;
    }

    setResult(res);
    Keyboard.dismiss();
  };

  // Reset inputs and result
  const handleClear = () => {
    setNum1('');
    setNum2('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simple Calculator</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First number"
          keyboardType="numeric"
          value={num1}
          onChangeText={(text) => setNum1(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Second number"
          keyboardType="numeric"
          value={num2}
          onChangeText={(text) => setNum2(text)}
        />
      </View>

      {/* Operation Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={() => calculate('+')}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => calculate('-')}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => calculate('*')}>
          <Text style={styles.btnText}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => calculate('/')}>
          <Text style={styles.btnText}>÷</Text>
        </TouchableOpacity>
      </View>

      {/* Clear Button */}
      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={styles.clearBtnText}>Clear</Text>
      </TouchableOpacity>

      {/* Result Display */}
      {result !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Result: {result}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  clearBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e1f5fe',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0288d1',
  },
});