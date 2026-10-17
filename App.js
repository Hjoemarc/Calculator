import React, { useState } from "react";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [saved, setSaved] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);

  function press(v) {
    if (["+", "-", "×", "÷"].includes(v)) {
      setSaved(Number(display));
      setOp(v);
      setFresh(true);
      return;
    }

    if (v === "AC") {
      setDisplay("0");
      setSaved(null);
      setOp(null);
      setFresh(true);
      return;
    }

    if (v === "DEL") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }

    if (v === "%") {
      setDisplay(String(Number(display) / 100));
      return;
    }

    if (v === "=") {
      if (saved === null || !op) return;
      const n = Number(display);
      let r = 0;
      if (op === "+") r = saved + n;
      if (op === "-") r = saved - n;
      if (op === "×") r = saved * n;
      if (op === "÷") r = n === 0 ? NaN : saved / n;
      setDisplay(Number.isFinite(r) ? String(Number(r.toFixed(8))) : "Error");
      setSaved(null);
      setOp(null);
      setFresh(true);
      return;
    }

    if (v === ".") {
      if (fresh) {
        setDisplay("0.");
        setFresh(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    if (fresh || display === "0" || display === "Error") {
      setDisplay(v);
      setFresh(false);
    } else {
      setDisplay(display + v);
    }
  }

  const rows = [
    ["AC", "DEL", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffe0ed, #f1ddff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      fontFamily: "Arial, sans-serif"
    }}>
      <section style={{
        width: "100%",
        maxWidth: 340,
        background: "#fff8fc",
        borderRadius: 28,
        padding: 20,
        boxShadow: "0 12px 30px #d99bbd55"
      }}>
        <h2 style={{ color: "#b84f83", textAlign: "center" }}>
          ♡ Pink Calculator ♡
        </h2>

        <div style={{
          background: "#fce8f2",
          color: "#84385f",
          padding: 20,
          borderRadius: 18,
          textAlign: "right",
          fontSize: 32,
          overflowWrap: "anywhere",
          marginBottom: 16
        }}>
          {display}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10
        }}>
          {rows.flat().map((v) => (
            <button key={v} onClick={() => press(v)} style={{
              border: "none",
              borderRadius: 15,
              padding: "17px 0",
              fontSize: 19,
              fontWeight: "bold",
              background: ["÷", "×", "-", "+", "="].includes(v)
                ? "#d98ab3"
                : ["AC", "DEL", "%"].includes(v)
                ? "#f5c3dc" : "#ffffff",
              color: "#84385f",
              boxShadow: "0 3px 7px #d99bbd33"
            }}>
              {v}
            </button>
          ))}
        </div>

        <p style={{
          textAlign: "center",
          color: "#b84f83",
          fontSize: 12
        }}>
          Made with ♡
        </p>
      </section>
    </main>
  );
    }
