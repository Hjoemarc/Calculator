
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

// Design update by June Mark C. Undik:
// Changed the original orange and green theme to a modern
// dark navy and electric blue color scheme.
const COLORS = {
  background: "#0B1020",
  card: "#151D32",
  number: "#202B45",
  operator: "#2563EB",
  accent: "#38BDF8",
  text: "#F8FAFC",
  secondary: "#8492AC",
  clear: "#3A2335",
  function: "#293650",
};

// Original calculator buttons retained.
// The updated design uses different colors and rounded buttons.
const BUTTONS = [
  [
    { label: "AC", value: "AC", type: "clear" },
    { label: "+/-", value: "+/-", type: "function" },
    { label: "%", value: "%", type: "function" },
    { label: "÷", value: "/", type: "operator" },
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "×", value: "*", type: "operator" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "−", value: "-", type: "operator" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "0", value: "0", wide: true },
    { label: ".", value: "." },
    { label: "=", value: "=", type: "equals" },
  ],
];

export default function App() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] =
    useState(false);
  const [calculation, setCalculation] = useState("");

  // Original clear function retained.
  const clear = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setCalculation("");
  };

  const inputDigit = (digit) => {
    if (display === "Error") {
      clear();
      setDisplay(String(digit));
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
    if (display === "Error" || waitingForSecondOperand) {
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

    setDisplay(String(parseFloat(display) / 100));
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

    return (
      Math.round((result + Number.EPSILON) * 1e10) / 1e10
    );
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
      if (nextOperator !== "=") {
        setFirstOperand(inputValue);
        setOperator(nextOperator);
        setCalculation(`${display} ${nextOperator}`);
        setWaitingForSecondOperand(true);
      }
      return;
    }

    if (operator && nextOperator === "=") {
      const expression =
        `${firstOperand} ${operator} ${display} =`;

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
      if (/^\d$/.test(btn)) {
        clear();
        setDisplay(btn);
      } else if (btn === ".") {
        clear();
        setDisplay("0.");
      }
      return;
    }

    if (/^\d$/.test(btn)) {
      inputDigit(btn);
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
    }
  };

  // Design update by June Mark C. Undik:
  // Formats long numbers so they fit inside the display.
  const formatDisplay = (value) => {
    if (value === "Error") return value;

    if (value.length > 13) {
      return Number(value).toExponential(5);
    }

    return value;
  };

  // Design update by June Mark C. Undik:
  // Updated button colors and text styles to match the new theme.
  const renderButton = (button) => {
    let backgroundColor = COLORS.number;

    if (button.type === "clear") {
      backgroundColor = COLORS.clear;
    } else if (button.type === "function") {
      backgroundColor = COLORS.function;
    } else if (button.type === "operator") {
      backgroundColor = COLORS.operator;
    } else if (button.type === "equals") {
      backgroundColor = COLORS.accent;
    }

    return (
      <TouchableOpacity
        key={button.value}
        activeOpacity={0.65}
        onPress={() => handlePress(button.value)}
        style={[
          styles.button,
          { backgroundColor },
          button.wide && styles.wideButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            button.type === "clear" && styles.clearText,
            button.type === "function" && styles.functionText,
            button.type === "operator" && styles.operatorText,
            button.type === "equals" && styles.equalsText,
          ]}
        >
          {button.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Design update by June Mark C. Undik:
          Redesigned the header with a new title, subtitle, and icon. */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appLabel}>SMART TOOLS  /  01</Text>
          <Text style={styles.heading}>Calculator</Text>
          <Text style={styles.subtitle}>
            Simple calculations, made easy.
          </Text>
        </View>

        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✳</Text>
        </View>
      </View>

      {/* Design update by June Mark C. Undik:
          Redesigned the display card with a mode badge,
          calculation expression, result, and status footer. */}
      <View style={styles.displayCard}>
        <View style={styles.displayTop}>
          <View style={styles.modeBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.modeText}>STANDARD</Text>
          </View>

          <Text style={styles.displayCaption}>RESULT</Text>
        </View>

        <View style={styles.expressionContainer}>
          <Text style={styles.expression} numberOfLines={1}>
            {calculation || "Ready to calculate"}
          </Text>
        </View>

        <View style={styles.resultContainer}>
          <Text
            style={[
              styles.result,
              display.length > 10 && styles.smallResult,
              display === "Error" && styles.errorText,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
          >
            {formatDisplay(display)}
          </Text>
        </View>

        <View style={styles.displayDivider} />

        <View style={styles.displayFooter}>
          <Text style={styles.footerHint}>CALCULATION PANEL</Text>
          <Text style={styles.liveText}>● READY</Text>
        </View>
      </View>

      {/* Design update by June Mark C. Undik:
          Added a keypad heading and a short instruction. */}
      <View style={styles.keypadHeader}>
        <Text style={styles.keypadTitle}>Keypad</Text>
        <Text style={styles.keypadHint}>Tap to calculate</Text>
      </View>

      {/* Original button layout retained with updated styling. */}
      <View style={styles.keypad}>
        {BUTTONS.map((row, rowIndex) => (
          <View style={styles.buttonRow} key={rowIndex}>
            {row.map(renderButton)}
          </View>
        ))}
      </View>

      {/* Design update by June Mark C. Undik:
          Added a decorative footer and calculator version. */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          DESIGNED FOR SIMPLICITY
        </Text>
        <Text style={styles.versionText}>CALC v1.0</Text>
      </View>
    </View>
  );
}

// Design update by June Mark C. Undik:
// Redesigned all styles for a modern dark interface,
// consistent spacing, rounded corners, and readable text.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 12,
  },

  // Updated header layout and typography.
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  appLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.5,
    marginBottom: 9,
  },

  heading: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 6,
  },

  // New decorative icon container.
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#172A49",
    borderWidth: 1,
    borderColor: "#294B7A",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    color: COLORS.accent,
    fontSize: 29,
  },

  // Updated result card with rounded corners and a subtle border.
  displayCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 17,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: "#27344E",
    minHeight: 190,
  },

  // New display card header.
  displayTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202D43",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#38BDF8",
    marginRight: 7,
  },

  modeText: {
    color: "#C6D5EA",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  displayCaption: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },

  // Improved expression positioning.
  expressionContainer: {
    alignItems: "flex-end",
    marginTop: 20,
  },

  expression: {
    color: COLORS.secondary,
    fontSize: 14,
    minHeight: 20,
  },

  // Improved result alignment and sizing.
  resultContainer: {
    minHeight: 66,
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 3,
  },

  result: {
    color: COLORS.text,
    fontSize: 49,
    fontWeight: "300",
    letterSpacing: -1.5,
  },

  smallResult: {
    fontSize: 34,
  },

  errorText: {
    color: "#FB7185",
    fontSize: 32,
  },

  // New divider separates the result and status footer.
  displayDivider: {
    height: 1,
    backgroundColor: "#2B3852",
    marginTop: 9,
    marginBottom: 13,
  },

  displayFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerHint: {
    color: "#71809C",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  liveText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // New heading above the calculator keypad.
  keypadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  keypadTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },

  keypadHint: {
    color: COLORS.secondary,
    fontSize: 11,
  },

  // Updated keypad spacing.
  keypad: {
    gap: 11,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 11,
  },

  // Design update by June Mark C. Undik:
  // Increased button corner radius and adjusted button height.
  button: {
    flex: 1,
    height: 62,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.045)",
  },

  // Makes the zero button wider than the other number buttons.
  wideButton: {
    flex: 2,
  },

  buttonText: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "600",
  },

  // Updated clear button text.
  clearText: {
    color: "#FDA4AF",
    fontSize: 17,
    fontWeight: "800",
  },

  functionText: {
    color: "#CBD5E1",
    fontSize: 17,
  },

  // Highlighted mathematical operators in electric blue.
  operatorText: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "500",
  },

  // Highlighted equals button with contrasting dark text.
  equalsText: {
    color: "#08233C",
    fontSize: 29,
    fontWeight: "800",
  },

  // Updated footer layout and typography.
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 17,
    paddingBottom: 4,
  },

  footerLine: {
    width: 34,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#354765",
    marginBottom: 10,
  },

  footerText: {
    color: "#71809C",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },

  versionText: {
    color: "#45536D",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 5,
  },
});