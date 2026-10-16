
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState(false);
  const [calculation, setCalculation] = useState("");

  const clear = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setCalculation("");
  };

  const inputDigit = (digit) => {
    if (display === "Error") {
      setDisplay(String(digit));
      setCalculation("");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (display === "Error") {
      setDisplay("0.");
      setCalculation("");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const toggleSign = () => {
    if (display === "Error" || display === "0") return;

    setDisplay(
      display.startsWith("-") ? display.slice(1) : "-" + display
    );
  };

  const inputPercent = () => {
    if (display === "Error") return;

    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const calculateResult = (left, right, op) => {
    let result;

    switch (op) {
      case "+":
        result = left + right;
        break;
      case "-":
        result = left - right;
        break;
      case "*":
        result = left * right;
        break;
      case "/":
        if (right === 0) return "Error";
        result = left / right;
        break;
      default:
        return right;
    }

    if (!Number.isFinite(result)) return "Error";

    return Math.round((result + Number.EPSILON) * 1e10) / 1e10;
  };

  const performOperation = (nextOperator) => {
    if (display === "Error") return;

    const inputValue = parseFloat(display);

    // Replace the operator if another operator is pressed.
    if (waitingForSecondOperand && nextOperator !== "=") {
      setOperator(nextOperator);

      if (firstOperand !== null) {
        setCalculation(`${firstOperand} ${nextOperator}`);
      }

      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);

      if (nextOperator !== "=") {
        setOperator(nextOperator);
        setCalculation(`${display} ${nextOperator}`);
        setWaitingForSecondOperand(true);
      }

      return;
    }

    if (operator && nextOperator === "=") {
      const expression = `${firstOperand} ${operator} ${display} =`;
      const result = calculateResult(
        firstOperand,
        inputValue,
        operator
      );

      setCalculation(expression);

      if (result === "Error") {
        setDisplay("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
      }

      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
      return;
    }

    if (operator) {
      const result = calculateResult(
        firstOperand,
        inputValue,
        operator
      );

      if (result === "Error") {
        setDisplay("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
      }

      setFirstOperand(result);
      setDisplay(String(result));
      setOperator(nextOperator);
      setCalculation(`${result} ${nextOperator}`);
      setWaitingForSecondOperand(true);
    }
  };

  const handleEquals = () => {
    if (
      operator !== null &&
      firstOperand !== null &&
      !waitingForSecondOperand
    ) {
      performOperation("=");
    }
  };

  const handlePress = (btn) => {
    if (btn === "AC") {
      clear();
      return;
    }

    if (display === "Error") {
      if (!isNaN(Number(btn)) || btn === ".") {
        if (btn === ".") {
          setDisplay("0.");
        } else {
          setDisplay(btn);
        }

        setCalculation("");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }

      return;
    }

    switch (btn) {
      case "+/-":
        toggleSign();
        break;
      case "%":
        inputPercent();
        break;
      case ".":
        inputDecimal();
        break;
      case "=":
        handleEquals();
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        performOperation(btn);
        break;
      default:
        inputDigit(parseInt(btn, 10));
        break;
    }
  };

  const getButtonStyle = (btn) => {
    if (btn === "AC") return styles.clearButton;

    if (btn === "+/-" || btn === "%") {
      return styles.utilityButton;
    }

    if (btn === "=") return styles.equalsButton;

    if (["/", "*", "-", "+"].includes(btn)) {
      return styles.operatorButton;
    }

    return styles.numberButton;
  };

  const getTextStyle = (btn) => {
    if (btn === "AC") return styles.clearText;

    if (btn === "+/-" || btn === "%") {
      return styles.utilityText;
    }

    if (btn === "=") return styles.equalsText;

    if (["/", "*", "-", "+"].includes(btn)) {
      return styles.operatorText;
    }

    return styles.numberText;
  };

  const rows = [
    ["AC", "+/-", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, sans-serif; }
        body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #111827; }
        .calculator { width: 100%; max-width: 340px; background: #312e81; border-radius: 20px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .app-header { text-align: center; color: #38bdf8; font-size: 0.95rem; font-weight: 600; margin-bottom: 16px; letter-spacing: 0.5px; }
        .display { background: #111827; border-radius: 12px; padding: 20px 16px; text-align: right; margin-bottom: 20px; min-height: 84px; display: flex; flex-direction: column; justify-content: space-between; word-break: break-all; }
        .previous-operand { color: #94a3b8; font-size: 1rem; min-height: 20px; }
        .current-operand { color: #f8fafc; font-size: 2.2rem; font-weight: 600; line-height: 1.1; }
        .keypad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .btn { height: 60px; font-size: 1.25rem; font-weight: 500; border: none; border-radius: 12px; cursor: pointer; transition: filter 0.15s ease, transform 0.05s ease; user-select: none; }
        .btn:active { transform: scale(0.96); }
        .btn-num { background-color: #4338ca; color: #f8fafc; }
        .btn-fn { background-color: #5b21b6; color: #e2e8f0; }
        .btn-op { background-color: #ec4899; color: #ffffff; font-size: 1.4rem; }
        .btn-eq { background-color: #06b6d4; color: #ffffff; font-size: 1.4rem; }
        .btn:hover { filter: brightness(1.15); }
      `}</style>

      <div className="calculator" style={{ backgroundColor: "#2f72ca" }}>
        <div className="app-header">Calculator By Danica Mae T. Radovan</div>
        <div className="display">
          <div className="previous-operand">
            {formatDisplay(calc.previous)} {calc.operation && calc.operation.replace('*', '×').replace('/', '÷')}
          </div>
          <div className="current-operand">{formatDisplay(calc.current)}</div>
        </div>
        <div className="keypad">
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
        </div>
      </div>
    </>
  );
}
