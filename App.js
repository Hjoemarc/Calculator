const http = require("http");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Calculator</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f172a;
    }
    .calculator {
      width: 100%;
      max-width: 340px;
      background: #1e293b;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .display {
      background: #0f172a;
      border-radius: 12px;
      padding: 20px 16px;
      text-align: right;
      margin-bottom: 20px;
      min-height: 84px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      word-break: break-all;
    }
    .previous-operand {
      color: #94a3b8;
      font-size: 1rem;
      min-height: 20px;
    }
    .current-operand {
      color: #f8fafc;
      font-size: 2.2rem;
      font-weight: 600;
      line-height: 1.1;
    }
    .keypad {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .btn {
      height: 60px;
      font-size: 1.25rem;
      font-weight: 500;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: filter 0.15s ease, transform 0.05s ease;
      user-select: none;
    }
    .btn:active {
      transform: scale(0.96);
    }
    .btn-num {
      background-color: #334155;
      color: #f8fafc;
    }
    .btn-fn {
      background-color: #475569;
      color: #e2e8f0;
    }
    .btn-op {
      background-color: #f59e0b;
      color: #ffffff;
      font-size: 1.4rem;
    }
    .btn-eq {
      background-color: #10b981;
      color: #ffffff;
      font-size: 1.4rem;
    }
    .btn:hover {
      filter: brightness(1.15);
    }
  </style>
</head>
<body>
  <div class="calculator">
    <div class="display">
      <div class="previous-operand" id="previousOperand"></div>
      <div class="current-operand" id="currentOperand">0</div>
    </div>
    <div class="keypad">
      <button class="btn btn-fn" data-action="clear">AC</button>
      <button class="btn btn-fn" data-action="delete">DEL</button>
      <button class="btn btn-fn" data-action="percent">%</button>
      <button class="btn btn-op" data-operator="/">÷</button>

      <button class="btn btn-num" data-number="7">7</button>
      <button class="btn btn-num" data-number="8">8</button>
      <button class="btn btn-num" data-number="9">9</button>
      <button class="btn btn-op" data-operator="*">×</button>

      <button class="btn btn-num" data-number="4">4</button>
      <button class="btn btn-num" data-number="5">5</button>
      <button class="btn btn-num" data-number="6">6</button>
      <button class="btn btn-op" data-operator="-">−</button>

      <button class="btn btn-num" data-number="1">1</button>
      <button class="btn btn-num" data-number="2">2</button>
      <button class="btn btn-num" data-number="3">3</button>
      <button class="btn btn-op" data-operator="+">+</button>

      <button class="btn btn-num" data-action="toggle-sign">±</button>
      <button class="btn btn-num" data-number="0">0</button>
      <button class="btn btn-num" data-number=".">.</button>
      <button class="btn btn-eq" data-action="calculate">=</button>
    </div>
  </div>

  <script>
    class Calculator {
      constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
      }

      clear() {
        this.currentOperand = "0";
        this.previousOperand = "";
        this.operation = undefined;
        this.shouldResetScreen = false;
      }

      delete() {
        if (this.shouldResetScreen) return;
        if (this.currentOperand === "0") return;
        if (this.currentOperand.length === 1 || this.currentOperand === "Error") {
          this.currentOperand = "0";
        } else {
          this.currentOperand = this.currentOperand.slice(0, -1);
        }
      }

      appendNumber(number) {
        if (this.shouldResetScreen || this.currentOperand === "Error") {
          this.currentOperand = "";
          this.shouldResetScreen = false;
        }
        if (number === "." && this.currentOperand.includes(".")) return;
        if (this.currentOperand === "0" && number !== ".") {
          this.currentOperand = number.toString();
        } else {
          this.currentOperand += number.toString();
        }
      }

      chooseOperation(operation) {
        if (this.currentOperand === "Error") return;
        if (this.currentOperand === "" && this.previousOperand !== "") {
          this.operation = operation;
          return;
        }
        if (this.previousOperand !== "") {
          this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
      }

      compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
          case "+":
            computation = prev + current;
            break;
          case "-":
            computation = prev - current;
            break;
          case "*":
            computation = prev * current;
            break;
          case "/":
            if (current === 0) {
              this.currentOperand = "Error";
              this.previousOperand = "";
              this.operation = undefined;
              this.shouldResetScreen = true;
              return;
            }
            computation = prev / current;
            break;
          default:
            return;
        }

        this.currentOperand = (Math.round(computation * 1e12) / 1e12).toString();
        this.operation = undefined;
        this.previousOperand = "";
        this.shouldResetScreen = true;
      }

      percent() {
        if (this.currentOperand === "Error") return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
      }

      toggleSign() {
        if (this.currentOperand === "Error" || this.currentOperand === "0") return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
      }

      getDisplayNumber(number) {
        if (number === "Error") return "Error";
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
          integerDisplay = "";
        } else {
          integerDisplay = integerDigits.toLocaleString("en", {
            maximumFractionDigits: 0,
          });
        }

        if (decimalDigits != null) {
          return \`\${integerDisplay}.\${decimalDigits}\`;
        } else {
          return integerDisplay;
        }
      }

      updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
          const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
          this.previousOperandTextElement.innerText = \`\${this.getDisplayNumber(this.previousOperand)} \${symbols[this.operation]}\`;
        } else {
          this.previousOperandTextElement.innerText = "";
        }
      }
    }

    const previousOperandTextElement = document.getElementById("previousOperand");
    const currentOperandTextElement = document.getElementById("currentOperand");
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    document.querySelectorAll("[data-number]").forEach((button) => {
      button.addEventListener("click", () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
      });
    });

    document.querySelectorAll("[data-operator]").forEach((button) => {
      button.addEventListener("click", () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
      });
    });

    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "clear") calculator.clear();
        if (action === "delete") calculator.delete();
        if (action === "calculate") calculator.compute();
        if (action === "percent") calculator.percent();
        if (action === "toggle-sign") calculator.toggleSign();
        calculator.updateDisplay();
      });
    });

    window.addEventListener("keydown", (e) => {
      if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        calculator.appendNumber(e.key);
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        calculator.chooseOperation(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculator.compute();
      } else if (e.key === "Backspace") {
        calculator.delete();
      } else if (e.key === "Escape") {
        calculator.clear();
      } else if (e.key === "%") {
        calculator.percent();
      }
      calculator.updateDisplay();
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});