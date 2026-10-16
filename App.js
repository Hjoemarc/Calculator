import React, { useState, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

const BUTTON_ROWS = [
  ["√", "x²", "1/x", "ANS"],
  ["AC", "DEL", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
];

const OPERATORS = {
  "÷": "/",
  "×": "*",
  "−": "-",
  "+": "+",
};

export default function App() {
  const [equation, setEquation] = useState("0");
  const [evaluated, setEvaluated] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("0");
  const scrollRef = useRef(null);

  const clear = () => {
    setEquation("0");
    setEvaluated(false);
  };

  const deleteDigit = () => {
    if (evaluated || equation === "Error") {
      setEquation("0");
      setEvaluated(false);
      return;
    }
    setEquation((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
  };

  const appendDigit = (num) => {
    if (evaluated || equation === "Error") {
      setEquation(num === "." ? "0." : num);
      setEvaluated(false);
      return;
    }
    setEquation((prev) => {
      if (num === ".") {
        const match = prev.match(/(\d+\.?\d*)$/);
        if (match && match[0].includes(".")) return prev;
      }
      if (prev === "0" && num !== ".") return num;
      return prev + num;
    });
  };

  const chooseOp = (op) => {
    if (equation === "Error") return;
    setEvaluated(false);
    setEquation((prev) => {
      const lastChar = prev.slice(-1);
      if (["+", "-", "*", "/"].includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  };

  const applyUnary = (operation) => {
    if (equation === "Error") return;
    try {
      let mathExpr = equation;
      if (["+", "-", "*", "/"].includes(mathExpr.slice(-1))) {
        mathExpr = mathExpr.slice(0, -1);
      }
      // eslint-disable-next-line no-eval
      let val = eval(mathExpr);
      let res = 0;

      if (operation === "%") res = val / 100;
      else if (operation === "±") res = val * -1;
      else if (operation === "√") res = Math.sqrt(val);
      else if (operation === "x²") res = val * val;
      else if (operation === "1/x") res = 1 / val;

      if (!isFinite(res) || isNaN(res)) {
        setEquation("Error");
        return;
      }

      res = Math.round(res * 1e10) / 1e10;
      setEquation(res.toString());
      setLastAnswer(res.toString());
      setEvaluated(true);
    } catch (e) {
      setEquation("Error");
    }
  };

  const compute = () => {
    if (equation === "Error") return;
    try {
      let mathExpr = equation;
      if (["+", "-", "*", "/"].includes(mathExpr.slice(-1))) {
        mathExpr = mathExpr.slice(0, -1);
      }
      // eslint-disable-next-line no-eval
      let res = eval(mathExpr);

      if (!isFinite(res) || isNaN(res)) {
        setEquation("Error");
        return;
      }

      res = Math.round(res * 1e10) / 1e10;
      setEquation(res.toString());
      setLastAnswer(res.toString());
      setEvaluated(true);
    } catch (e) {
      setEquation("Error");
    }
  };

  const appendAns = () => {
    if (evaluated || equation === "Error" || equation === "0") {
      setEquation(lastAnswer);
      setEvaluated(false);
    } else {
      setEquation((prev) => prev + lastAnswer);
    }
  };

  const handlePress = (label) => {
    if (label === "AC") clear();
    else if (label === "DEL") deleteDigit();
    else if (label === "=") compute();
    else if (label === "ANS") appendAns();
    else if (["%", "±", "√", "x²", "1/x"].includes(label)) applyUnary(label);
    else if (OPERATORS[label]) chooseOp(OPERATORS[label]);
    else appendDigit(label);
  };

  const formatDisplay = (expr) => {
    if (expr === "Error") return expr;
    let formatted = expr.replace(/\d+\.?\d*/g, (match) => {
      const [integer, decimal] = match.split(".");
      if (!integer) return match;
      const intDisplay = parseInt(integer, 10).toLocaleString("en");
      return decimal !== undefined ? `${intDisplay}.${decimal}` : intDisplay;
    });
    return formatted.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
  };

  const buttonStyle = (label) => {
    if (["AC", "DEL", "ANS"].includes(label)) return styles.actionButton;
    if (["√", "x²", "1/x"].includes(label)) return styles.scientificButton;
    if (label === "=") return styles.equalsButton;
    if (Object.prototype.hasOwnProperty.call(OPERATORS, label)) {
      return styles.operatorButton;
    }
    if (label === "%" || label === "±") return styles.utilityButton;
    return styles.numberButton;
  };

  const buttonTextStyle = (label) => {
    if (label === "=") return styles.equalsText;
    if (["AC", "DEL", "ANS"].includes(label)) return styles.actionText;
    if (Object.prototype.hasOwnProperty.call(OPERATORS, label)) {
      return styles.operatorText;
    }
    if (["√", "x²", "1/x", "ANS"].includes(label)) {
      return styles.scientificText;
    }
    if (label === "AC" || label === "DEL" || label === "%" || label === "±") {
      return styles.utilityText;
    }
    return styles.numberText;
  };

  const displayFontSize = equation.length > 10 ? 34 : equation.length > 7 ? 42 : 52;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2FB" />
      <View style={styles.content}>
        <View style={styles.calculatorCard}>
          <View style={styles.header}>
            <View style={styles.heading}>
              <Text style={styles.title}>CALCULATOR</Text>
            </View>
          </View>

          <View style={styles.display}>
            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%" }} // Forces ScrollView to stay inside container
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end", // Keeps text to the right when short
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.result, { fontSize: displayFontSize }]}
                numberOfLines={1}
                accessibilityRole="text"
                accessibilityLabel={`Display ${equation}`}
              >
                {formatDisplay(equation)}
              </Text>
            </ScrollView>
          </View>

          <View style={styles.keypad}>
            {BUTTON_ROWS.map((row, rowIndex) => (
              <View style={styles.buttonRow} key={`row-${rowIndex}`}>
                {row.map((label) => (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.72}
                    accessibilityRole="button"
                    accessibilityLabel={label === "DEL" ? "Delete" : label}
                    onPress={() => handlePress(label)}
                    style={[styles.button, buttonStyle(label)]}
                  >
                    <Text style={[styles.buttonText, buttonTextStyle(label)]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF2FB",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    maxWidth: 426,
    alignSelf: "center",
  },
  calculatorCard: {
    backgroundColor: "#fbfcff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#9bb4d9",
    padding: 18,
    shadowColor: "#243860",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  heading: {
    flex: 1,
  },
  title: {
    color: "#8A94AD",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  display: {
    minHeight: 102,
    justifyContent: "center",
    backgroundColor: "#9d9d9d",
    borderWidth: 1,
    borderColor: "#E1E7F0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    overflow: "hidden",
  },
  result: {
    color: "#e7eeff",
    fontWeight: "600",
    maxWidth: "100%",
  },
  keypad: {
    gap: 9,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 9,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    backgroundColor: "#007bf6",
    borderWidth: 1,
    borderColor: "#E1E7F0",
  },
  utilityButton: {
    backgroundColor: "#8b919e",
  },
  actionButton: {
    backgroundColor: "#DCE3F5",
  },
  scientificButton: {
    backgroundColor: "#EAEFFB",
    borderWidth: 1,
    borderColor: "#DCE3F5",
  },
  operatorButton: {
    backgroundColor: "#0eeeee",
  },
  equalsButton: {
    backgroundColor: "#3558E0",
    shadowColor: "#3558E0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
  },
  numberText: {
    color: "#1F2A44",
  },
  utilityText: {
    color: "#4A5A8A",
    fontSize: 18,
  },
  actionText: {
    color: "#4A5A8A",
    fontSize: 17,
  },
  scientificText: {
    color: "#4A5A8A",
    fontSize: 16,
    fontWeight: "600",
  },
  operatorText: {
    color: "#3558E0",
    fontSize: 25,
  },
  equalsText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },
});