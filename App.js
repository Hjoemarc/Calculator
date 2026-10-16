
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
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Calculator</Text>
        </View>
      </View>

      {/* Calculation and Result Display */}
      <View style={styles.displayContainer}>

        <View style={styles.displayBox}>
          <Text
            style={styles.calculationText}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {calculation || " "}
          </Text>

          <View style={styles.displayDivider} />

          <Text style={styles.resultLabel}>RESULT</Text>

          <Text
            style={styles.displayText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.35}
          >
            {display}
          </Text>
        </View>

        <View style={styles.displayUnderline} />
      </View>
    
      <View style={styles.buttonsContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={[
                  styles.button,
                  getButtonStyle(btn),
                  btn === "0" && styles.zeroButton,
                ]}
                onPress={() => handlePress(btn)}
                activeOpacity={0.65}
              >
                <Text style={getTextStyle(btn)}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  appLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#8B5CF6",
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#171725",
    letterSpacing: -1,
  },
  displayContainer: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 22,
  },
  displayBox: {
    width: "100%",
    minHeight: 145,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#F8FAFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E9E8FF",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  calculationText: {
    width: "100%",
    minHeight: 32,
    color: "#8B5CF6",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 12,
  },
  displayDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E9E8FF",
    marginBottom: 12,
  },
  resultLabel: {
    alignSelf: "flex-end",
    color: "#A1A1B5",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  displayText: {
    color: "#171725",
    fontSize: 56,
    fontWeight: "300",
    letterSpacing: -2,
  },
  displayUnderline: {
    width: "100%",
    height: 4,
    borderRadius: 4,
    backgroundColor: "#B7FF3C",
    marginTop: 12,
    alignSelf: "center",
  },
  keypadHint: {
    color: "#A1A1B5",
    fontSize: 11,
  },

  buttonsContainer: {
    flex: 5,
    paddingBottom: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 45,
    shadowColor: "#777799",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 2,
  },

  numberButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECF5",
  },
  numberText: {
    color: "#29293D",
    fontSize: 27,
    fontWeight: "600",
  },

  clearButton: {
    backgroundColor: "#D9FF8A",
    borderWidth: 1,
    borderColor: "#B7FF3C",
  },
  clearText: {
    color: "#355600",
    fontSize: 17,
    fontWeight: "800",
  },

  utilityButton: {
    backgroundColor: "#F0E9FF",
    borderWidth: 1,
    borderColor: "#DCCBFF",
  },
  utilityText: {
    color: "#7742D8",
    fontSize: 20,
    fontWeight: "700",
  },

  operatorButton: {
    backgroundColor: "#E7FBFF",
    borderWidth: 1,
    borderColor: "#9CEFFF",
  },
  operatorText: {
    color: "#009CB5",
    fontSize: 29,
    fontWeight: "700",
  },

  equalsButton: {
    backgroundColor: "#B7FF3C",
    borderWidth: 1,
    borderColor: "#A1F020",
    shadowColor: "#9BEB24",
    shadowOpacity: 0.28,
    shadowRadius: 9,
    elevation: 5,
  },
  equalsText: {
    color: "#243900",
    fontSize: 30,
    fontWeight: "800",
  },

  zeroButton: {
    flex: 2,
    alignItems: "flex-start",
    paddingLeft: 28,
  },
});
