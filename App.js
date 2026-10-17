
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';

const KEYS = [
  'AC', 'DEL', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '−',
  '1', '2', '3', '+',
  '00', '0', '.', '='
];

const OPERATORS = ['+', '−', '×', '÷'];

function evaluateExpression(expression) {
  const normalized = expression.replace(/[×÷−]/g, (char) => ({
    '×': '*',
    '÷': '/',
    '−': '-'
  })[char]);

  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error('Invalid expression');
  }

  const tokens = normalized.match(/\d*\.?\d+|[()+*/-]/g);

  if (!tokens || tokens.join('') !== normalized.replace(/\s/g, '')) {
    throw new Error('Invalid expression');
  }

  let index = 0;

  function parseExpression() {
    let value = parseTerm();

    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++];
      const next = parseTerm();
      value = operator === '+' ? value + next : value - next;
    }

    return value;
  }

  function parseTerm() {
    let value = parseFactor();

    while (tokens[index] === '*' || tokens[index] === '/') {
      const operator = tokens[index++];
      const next = parseFactor();

      if (operator === '/' && next === 0) {
        throw new Error('Cannot divide by zero');
      }

      value = operator === '*' ? value * next : value / next;
    }

    return value;
  }

  function parseFactor() {
    if (tokens[index] === '-') {
      index++;
      return -parseFactor();
    }

    if (tokens[index] === '+') {
      index++;
      return parseFactor();
    }

    if (tokens[index] === '(') {
      index++;
      const value = parseExpression();

      if (tokens[index] !== ')') {
        throw new Error('Invalid expression');
      }

      index++;
      return value;
    }

    const token = tokens[index++];

    if (token === undefined || !/^\d*\.?\d+$/.test(token)) {
      throw new Error('Invalid expression');
    }

    return Number(token);
  }

  const value = parseExpression();

  if (index !== tokens.length || !Number.isFinite(value)) {
    throw new Error('Invalid expression');
  }

  return Number(value.toPrecision(12));
}

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const press = (key) => {
    if (key === 'AC') {
      setExpression('');
      setResult('0');
      setFinished(false);
      return;
    }

    if (key === 'DEL') {
      if (finished) {
        setExpression('');
        setResult('0');
        setFinished(false);
      } else {
        setExpression((previous) => previous.slice(0, -1));
      }
      return;
    }

    if (key === '=') {
      if (!expression) return;

      try {
        const answer = evaluateExpression(expression);
        const formatted = String(answer);

        setHistory((previous) => [
          { expression, result: formatted },
          ...previous
        ].slice(0, 5));

        setResult(formatted);
        setExpression('');
        setFinished(true);
      } catch {
        setResult('Invalid');
        setExpression('');
        setFinished(false);
      }

      return;
    }

    if (key === '%') {
      const current = expression || (finished ? result : '');

      if (current && Number.isFinite(Number(current))) {
        setExpression(String(Number(current) / 100));
        setFinished(false);
      }
      return;
    }

    if (key === '.') {
      const source = finished ? '' : expression;
      const lastNumber = source.split(/[+\-×÷*/]/).pop();

      if (lastNumber.includes('.')) return;

      setExpression(source + (source === '' ? '0.' : '.'));
      setFinished(false);
      return;
    }

    const isOperator = OPERATORS.includes(key);

    setExpression((previous) => {
      let source = finished && !isOperator ? '' : previous;

      if (finished && isOperator) {
        source = result;
      }

      if (isOperator && !source && key !== '−') return source;

      if (isOperator && /[+\-×÷]$/.test(source)) {
        return source.slice(0, -1) + key;
      }

      return source + key;
    });

    setFinished(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#201629" />

      <View style={styles.background}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <View>
              <Text style={styles.eyebrow}>YOUR DAILY ESSENTIAL</Text>
              <Text style={styles.appTitle}>Cherry<Text style={styles.titleAccent}>Calc.</Text></Text>
            </View>

            <View style={styles.topIcon}>
              <Text style={styles.topIconText}>✿</Text>
            </View>
          </View>

          <View style={styles.calculator}>
            <View style={styles.displayTop}>
              <View style={styles.statusDot} />
              <Text style={styles.displayCaption}>CALCULATOR</Text>
              <Text style={styles.displayHeart}>♡</Text>
            </View>

            <View style={styles.displayScreen}>
              <Text style={styles.expressionText} numberOfLines={2}>
                {expression || ' '}
              </Text>

              <Text
                style={styles.resultText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {result}
              </Text>

              <View style={styles.resultUnderline} />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerIcon}>✦</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.keypad}>
              {KEYS.map((key) => {
                const utility = ['AC', 'DEL', '%'].includes(key);
                const operator = OPERATORS.includes(key);
                const equals = key === '=';
                const doubleZero = key === '00';

                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.65}
                    onPress={() => press(key)}
                    style={[
                      styles.key,
                      utility && styles.utilityKey,
                      operator && styles.operatorKey,
                      equals && styles.equalsKey,
                      doubleZero && styles.doubleZeroKey
                    ]}
                  >
                    <Text
                      style={[
                        styles.keyText,
                        utility && styles.utilityText,
                        operator && styles.operatorText,
                        equals && styles.equalsText
                      ]}
                    >
                      {key === 'DEL' ? '⌫' : key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.bottomNote}>
              <Text style={styles.noteFlower}>✿</Text>
              <Text style={styles.noteText}>a little sweetness in every sum</Text>
              <Text style={styles.noteFlower}>✿</Text>
            </View>
          </View>

          <View style={styles.historySection}>
            <View style={styles.historyHeading}>
              <Text style={styles.historyTitle}>Recent calculations</Text>
              <Text style={styles.historySymbol}>♡</Text>
            </View>

            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyIcon}>✧</Text>
                <Text style={styles.emptyText}>Your calculations will appear here</Text>
              </View>
            ) : (
              history.map((item, index) => (
                <TouchableOpacity
                  key={`${item.expression}-${index}`}
                  activeOpacity={0.75}
                  style={styles.historyItem}
                  onPress={() => {
                    setExpression(item.expression);
                    setResult(item.result);
                    setFinished(false);
                  }}
                >
                  <View style={styles.historyItemText}>
                    <Text style={styles.historyExpression}>{item.expression}</Text>
                    <Text style={styles.historyAnswer}>= {item.result}</Text>
                  </View>
                  <Text style={styles.historyArrow}>↗</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <Text style={styles.footerText}>MADE WITH LOVE AND A LITTLE MAGIC ♡</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#201629'
  },
  background: {
    flex: 1,
    backgroundColor: '#201629',
    overflow: 'hidden'
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 35
  },
  glowOne: {
    position: 'absolute',
    top: 80,
    right: -110,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#663A6D',
    opacity: 0.2
  },
  glowTwo: {
    position: 'absolute',
    bottom: 100,
    left: -130,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#B84F83',
    opacity: 0.13
  },
  topBar: {
    width: '100%',
    maxWidth: 390,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 27
  },
  eyebrow: {
    color: '#C49AB8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 5
  },
  appTitle: {
    color: '#FFF5FA',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.5
  },
  titleAccent: {
    color: '#F5A9CE'
  },
  topIcon: {
    width: 53,
    height: 53,
    borderRadius: 19,
    backgroundColor: '#3B2942',
    borderWidth: 1,
    borderColor: '#69405D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topIconText: {
    color: '#F5A9CE',
    fontSize: 30
  },
  calculator: {
    width: '100%',
    maxWidth: 390,
    padding: 21,
    borderRadius: 30,
    backgroundColor: '#2B2033',
    borderWidth: 1,
    borderColor: '#493249',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12
  },
  displayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F5A9CE',
    marginRight: 8
  },
  displayCaption: {
    flex: 1,
    color: '#B99AB9',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2.5
  },
  displayHeart: {
    color: '#F5A9CE',
    fontSize: 19
  },
  displayScreen: {
    minHeight: 143,
    paddingHorizontal: 17,
    paddingVertical: 20,
    justifyContent: 'center',
    backgroundColor: '#211829',
    borderWidth: 1,
    borderColor: '#493249',
    borderRadius: 22
  },
  expressionText: {
    minHeight: 27,
    color: '#BCA3C0',
    fontSize: 18,
    textAlign: 'right'
  },
  resultText: {
    color: '#FFF2FA',
    fontSize: 43,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 8
  },
  resultUnderline: {
    width: 45,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F5A9CE',
    alignSelf: 'flex-end',
    marginTop: 12
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 21
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#493249'
  },
  dividerIcon: {
    color: '#DDA0C6',
    fontSize: 12
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12
  },
  key: {
    width: '22.5%',
    height: 59,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#403047',
    borderWidth: 1,
    borderColor: '#513A54'
  },
  keyText: {
    color: '#FFF5FC',
    fontSize: 20,
    fontWeight: '700'
  },
  utilityKey: {
    backgroundColor: '#47304C',
    borderColor: '#6A4267'
  },
  utilityText: {
    color: '#E5A9D0',
    fontSize: 16,
    fontWeight: '900'
  },
  operatorKey: {
    backgroundColor: '#F0B4D5',
    borderColor: '#F0B4D5'
  },
  operatorText: {
    color: '#542846',
    fontSize: 24,
    fontWeight: '800'
  },
  equalsKey: {
    backgroundColor: '#C9A9F5',
    borderColor: '#D8BDFB'
  },
  equalsText: {
    color: '#332044',
    fontSize: 27,
    fontWeight: '900'
  },
  doubleZeroKey: {
    width: '48%'
  },
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24
  },
  noteFlower: {
    color: '#E7A7CF',
    fontSize: 13
  },
  noteText: {
    color: '#B99AB9',
    fontSize: 10,
    fontWeight: '600'
  },
  historySection: {
    width: '100%',
    maxWidth: 390,
    marginTop: 30
  },
  historyHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13
  },
  historyTitle: {
    color: '#FFF1FA',
    fontSize: 17,
    fontWeight: '800'
  },
  historySymbol: {
    color: '#F5A9CE',
    fontSize: 22
  },
  emptyHistory: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#453249',
    borderRadius: 19,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#291F31'
  },
  emptyIcon: {
    color: '#DDA0C6',
    fontSize: 22,
    marginBottom: 4
  },
  emptyText: {
    color: '#B99AB9',
    fontSize: 11
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    marginBottom: 9,
    backgroundColor: '#302339',
    borderWidth: 1,
    borderColor: '#493249'
  },
  historyItemText: {
    flex: 1
  },
  historyExpression: {
    color: '#BCA3C0',
    fontSize: 12
  },
  historyAnswer: {
    color: '#F5C4DE',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4
  },
  historyArrow: {
    color: '#D8A4D1',
    fontSize: 20,
    marginLeft: 12
  },
  footerText: {
    color: '#806786',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 28
  }
});
