
import React, { useState, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
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

// Safe arithmetic parser: supports +, -, *, / and parentheses.
function evaluateExpression(input) {
  const tokens = input.match(/\d*\.?\d+|[+\-*/()]/g);

  if (!tokens || tokens.join("") !== input.replace(/\s/g, "")) {
    throw new Error("Invalid expression");
  }

  let index = 0;

  function expression() {
    let value = term();

    while (tokens[index] === "+" || tokens[index] === "-") {
      const op = tokens[index++];
      const right = term();
      value = op === "+" ? value + right : value - right;
    }

    return value;
  }

  function term() {
    let value = factor();

    while (tokens[index] === "*" || tokens[index] === "/") {
      const op = tokens[index++];
      const right = factor();

      if (op === "/" && right === 0) {
        throw new Error("Division by zero");
      }

      value = op === "*" ? value * right : value / right;
    }

    return value;
  }

  function factor() {
    const token = tokens[index];

    if (token === "+") {
      index++;
      return factor();
    }

    if (token === "-") {
      index++;
      return -factor();
    }

    if (token === "(") {
      index++;
      const value = expression();

      if (tokens[index] !== ")") {
        throw new Error("Missing closing parenthesis");
      }

      index++;
      return value;
    }

    if (token === undefined || !/^\d*\.?\d+$/.test(token)) {
      throw new Error("Invalid number");
    }

    index++;
    return Number(token);
  }

  const result = expression();

  if (index !== tokens.length || !Number.isFinite(result)) {
    throw new Error("Invalid result");
  }

  return result;
}

function cleanNumber(value) {
  return String(Math.round(value * 1e10) / 1e10);
}

export default function App() {
  const [equation, setEquation] = useState("0");
  const [evaluated, setEvaluated] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("0");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  const formatDisplay = (expr) => {
    if (expr === "Error") return expr;

    return expr
      .replace(/\*/g, "×")
      .replace(/\//g, "÷")
      .replace(/-/g, "−")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const addToHistory = (expr, result) => {
    setHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        expression: formatDisplay(expr),
        result: cleanNumber(result),
      },
      ...prev,
    ]);
  };

  const clear = () => {
    setEquation("0");
    setEvaluated(false);
  };

  const deleteDigit = () => {
    if (evaluated || equation === "Error") {
      clear();
      return;
    }

    setEquation((prev) =>
      prev.length <= 1 ? "0" : prev.slice(0, -1)
    );
  };

  const appendDigit = (num) => {
    if (evaluated || equation === "Error") {
      setEquation(num === "." ? "0." : num);
      setEvaluated(false);
      return;
    }

    setEquation((prev) => {
      if (num === ".") {
        const currentNumber = prev.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) return prev;

        return prev + ".";
      }

      if (prev === "0") return num;

      return prev + num;
    });
  };

  const chooseOp = (op) => {
    if (equation === "Error") return;

    setEvaluated(false);

    setEquation((prev) => {
      if (prev === "0" && op !== "-") return prev + op;

      if (["+", "-", "*", "/"].includes(prev.slice(-1))) {
        return prev.slice(0, -1) + op;
      }

      return prev + op;
    });
  };

  const applyUnary = (operation) => {
    if (equation === "Error") return;

    try {
      let expr = equation;

      if (["+", "-", "*", "/"].includes(expr.slice(-1))) {
        expr = expr.slice(0, -1);
      }

      const value = evaluateExpression(expr);
      let result;

      switch (operation) {
        case "%":
          result = value / 100;
          break;
        case "±":
          result = -value;
          break;
        case "√":
          if (value < 0) throw new Error("Invalid square root");
          result = Math.sqrt(value);
          break;
        case "x²":
          result = value * value;
          break;
        case "1/x":
          if (value === 0) throw new Error("Division by zero");
          result = 1 / value;
          break;
        default:
          return;
      }

      if (!Number.isFinite(result)) {
        throw new Error("Invalid result");
      }

      result = cleanNumber(result);
      addToHistory(
        operation === "√" ? `√(${expr})` :
        operation === "x²" ? `${expr}²` :
        operation === "1/x" ? `1/(${expr})` :
        operation === "±" ? `-(${expr})` :
        `${expr}%`,
        result
      );

      setEquation(result);
      setLastAnswer(result);
      setEvaluated(true);
    } catch {
      setEquation("Error");
      setEvaluated(true);
    }
  };

  const compute = () => {
    if (equation === "Error") return;

    try {
      let expr = equation;

      if (["+", "-", "*", "/"].includes(expr.slice(-1))) {
        expr = expr.slice(0, -1);
      }

      const result = cleanNumber(evaluateExpression(expr));

      addToHistory(equation, result);
      setEquation(result);
      setLastAnswer(result);
      setEvaluated(true);
    } catch {
      setEquation("Error");
      setEvaluated(true);
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
    else if (["%", "±", "√", "x²", "1/x"].includes(label)) {
      applyUnary(label);
    } else if (OPERATORS[label]) {
      chooseOp(OPERATORS[label]);
    } else {
      appendDigit(label);
    }
  };

  const buttonStyle = (label) => {
    if (label === "=") return styles.equalsButton;
    if (["AC", "DEL", "ANS"].includes(label)) return styles.actionButton;
    if (["√", "x²", "1/x"].includes(label)) return styles.scientificButton;
    if (OPERATORS[label]) return styles.operatorButton;
    if (["%", "±"].includes(label)) return styles.utilityButton;
    return styles.numberButton;
  };

  const buttonTextStyle = (label) => {
    if (label === "=") return styles.equalsText;
    if (["AC", "DEL", "ANS"].includes(label)) return styles.actionText;
    if (OPERATORS[label]) return styles.operatorText;
    if (["√", "x²", "1/x"].includes(label)) return styles.scientificText;
    if (["%", "±"].includes(label)) return styles.utilityText;
    return styles.numberText;
  };

  const displayFontSize =
    equation.length > 15 ? 25 :
    equation.length > 10 ? 32 :
    equation.length > 7 ? 40 : 50;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#160D2B" />

      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />
      <View style={styles.orbThree} />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>ƒ</Text>
              </View>

              <View>
                <Text style={styles.title}>CALCULATOR</Text>
                <Text style={styles.subtitle}>SMART & SIMPLE</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setShowHistory(true)}
              accessibilityRole="button"
            >
              <Text style={styles.historyButtonText}>◷ History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.display}>
            <View style={styles.displayHeader}>
              <Text style={styles.displayLabel}>
                {evaluated ? "RESULT" : "ENTER EXPRESSION"}
              </Text>
              <Text style={styles.ready}>● READY</Text>
            </View>

            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
              contentContainerStyle={styles.displayScroll}
            >
              <Text
                style={[
                  styles.result,
                  { fontSize: displayFontSize },
                  evaluated && styles.finalResult,
                  equation === "Error" && styles.errorResult,
                ]}
                numberOfLines={1}
              >
                {formatDisplay(equation)}
              </Text>
            </ScrollView>

            <View style={styles.answerRow}>
              <View style={styles.answerLine} />
              <Text style={styles.answerText}>
                ANS: {formatDisplay(lastAnswer)}
              </Text>
            </View>
          </View>

          <View style={styles.keypad}>
            {BUTTON_ROWS.map((row, rowIndex) => (
              <View style={styles.buttonRow} key={rowIndex}>
                {row.map((label, index) => (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.65}
                    onPress={() => handlePress(label)}
                    accessibilityRole="button"
                    accessibilityLabel={label === "DEL" ? "Delete" : label}
                    style={[
                      styles.button,
                      index !== row.length - 1 && styles.buttonSpacing,
                      buttonStyle(label),
                    ]}
                  >
                    <Text style={[styles.buttonText, buttonTextStyle(label)]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>PURPLE GLASS EDITION</Text>
            <View style={styles.footerLine} />
          </View>
        </View>
      </View>

      <Modal
        visible={showHistory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>YOUR CALCULATIONS</Text>
                <Text style={styles.modalTitle}>History</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowHistory(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyIcon}>◷</Text>
                <Text style={styles.emptyTitle}>No calculations yet</Text>
                <Text style={styles.emptyText}>
                  Your calculations will appear here.
                </Text>
              </View>
            ) : (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.historyList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.historyItem}
                    onPress={() => {
                      setEquation(item.result);
                      setLastAnswer(item.result);
                      setEvaluated(true);
                      setShowHistory(false);
                    }}
                  >
                    <Text style={styles.historyExpr}>{item.expression}</Text>
                    <Text style={styles.historyResult}>
                      = {formatDisplay(item.result)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {history.length > 0 && (
              <TouchableOpacity
                style={styles.clearHistoryButton}
                onPress={() => setHistory([])}
              >
                <Text style={styles.clearHistoryText}>Clear All History</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowHistory(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#160D2B",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: "hidden",
  },
  orbOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#7628D8",
    opacity: 0.24,
    top: -70,
    right: -90,
  },
  orbTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#4530BD",
    opacity: 0.22,
    bottom: -40,
    left: -90,
  },
  orbThree: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#C084FC",
    opacity: 0.08,
    top: "40%",
    right: -90,
  },
  content: {
    width: "100%",
    maxWidth: 426,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "rgba(48, 32, 76, 0.96)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(221, 194, 255, 0.3)",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(192, 132, 252, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: {
    color: "#E9D5FF",
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    color: "#F5EEFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  subtitle: {
    color: "#B7A2D7",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  historyButton: {
    backgroundColor: "rgba(192, 132, 252, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.28)",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 13,
  },
  historyButtonText: {
    color: "#E9D5FF",
    fontSize: 12,
    fontWeight: "700",
  },
  display: {
    minHeight: 150,
    backgroundColor: "rgba(16, 9, 32, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.23)",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 17,
    overflow: "hidden",
  },
  displayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  displayLabel: {
    color: "#A995C9",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  ready: {
    color: "#C4B5FD",
    fontSize: 9,
    fontWeight: "700",
  },
  displayScroll: {
    flexGrow: 1,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  result: {
    color: "#F5EEFF",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  finalResult: {
    color: "#D8B4FE",
    fontWeight: "700",
  },
  errorResult: {
    color: "#FDA4AF",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  answerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(216, 180, 254, 0.16)",
    marginRight: 10,
  },
  answerText: {
    color: "#A995C9",
    fontSize: 10,
    fontWeight: "600",
  },
  keypad: {},
  buttonRow: {
    flexDirection: "row",
    marginBottom: 9,
  },
  button: {
    flex: 1,
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonSpacing: {
    marginRight: 9,
  },
  numberButton: {
    backgroundColor: "rgba(174, 145, 220, 0.12)",
    borderColor: "rgba(216, 180, 254, 0.17)",
  },
  utilityButton: {
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    borderColor: "rgba(196, 181, 253, 0.25)",
  },
  actionButton: {
    backgroundColor: "rgba(192, 132, 252, 0.15)",
    borderColor: "rgba(216, 180, 254, 0.25)",
  },
  scientificButton: {
    backgroundColor: "rgba(126, 87, 194, 0.22)",
    borderColor: "rgba(196, 181, 253, 0.22)",
  },
  operatorButton: {
    backgroundColor: "rgba(139, 92, 246, 0.25)",
    borderColor: "rgba(196, 181, 253, 0.3)",
  },
  equalsButton: {
    backgroundColor: "#A855F7",
    borderColor: "#C084FC",
    elevation: 5,
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
  },
  numberText: {
    color: "#F5EEFF",
    fontSize: 21,
  },
  utilityText: {
    color: "#E9D5FF",
    fontSize: 18,
  },
  actionText: {
    color: "#E9D5FF",
    fontSize: 14,
    fontWeight: "700",
  },
  scientificText: {
    color: "#D8B4FE",
    fontSize: 15,
    fontWeight: "700",
  },
  operatorText: {
    color: "#D8B4FE",
    fontSize: 25,
  },
  equalsText: {
    color: "#FFF",
    fontSize: 27,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(216, 180, 254, 0.15)",
  },
  footerText: {
    color: "#A995C9",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 4, 18, 0.78)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#241638",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.22)",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: "80%",
    minHeight: 330,
  },
  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#79628F",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(216, 180, 254, 0.13)",
  },
  modalEyebrow: {
    color: "#B7A2D7",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#F5EEFF",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "rgba(192, 132, 252, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 17,
    color: "#D8B4FE",
    fontWeight: "700",
  },
  emptyHistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyIcon: {
    color: "#D8B4FE",
    fontSize: 38,
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#F5EEFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
  },
  emptyText: {
    color: "#A995C9",
    fontSize: 13,
    textAlign: "center",
  },
  historyList: {
    paddingBottom: 8,
  },
  historyItem: {
    backgroundColor: "rgba(174, 145, 220, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(216, 180, 254, 0.13)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  historyExpr: {
    color: "#B7A2D7",
    fontSize: 13,
    textAlign: "right",
    marginBottom: 8,
  },
  historyResult: {
    color: "#F5EEFF",
    fontSize: 21,
    fontWeight: "800",
    textAlign: "right",
  },
  clearHistoryButton: {
    marginTop: 8,
    backgroundColor: "rgba(251, 113, 133, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(251, 113, 133, 0.22)",
    padding: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  clearHistoryText: {
    color: "#FDA4AF",
    fontWeight: "700",
    fontSize: 13,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: "#8B5CF6",
    borderWidth: 1,
    borderColor: "#A78BFA",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  doneText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});
