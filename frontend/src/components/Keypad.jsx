import React from 'react';

export default function Keypad({ onDigit, onOperator, onEqual, onClear, onClearEntry, onBackspace, onUnary }) {
  return (
    <div className="calculator-keypad">
      {/* Row 1 */}
      <button className="btn btn-fn btn-clear" onClick={onClear} title="Clear All (Esc)">C</button>
      <button className="btn btn-fn" onClick={onClearEntry} title="Clear Current Entry">CE</button>
      <button className="btn btn-fn" onClick={onBackspace} title="Backspace (Backspace)">⌫</button>
      <button className="btn btn-op" onClick={() => onOperator('/')} title="Divide (/)">÷</button>

      {/* Row 2 */}
      <button className="btn btn-num" onClick={() => onDigit('7')}>7</button>
      <button className="btn btn-num" onClick={() => onDigit('8')}>8</button>
      <button className="btn btn-num" onClick={() => onDigit('9')}>9</button>
      <button className="btn btn-op" onClick={() => onOperator('*')} title="Multiply (*)">×</button>

      {/* Row 3 */}
      <button className="btn btn-num" onClick={() => onDigit('4')}>4</button>
      <button className="btn btn-num" onClick={() => onDigit('5')}>5</button>
      <button className="btn btn-num" onClick={() => onDigit('6')}>6</button>
      <button className="btn btn-op" onClick={() => onOperator('-')} title="Subtract (-)">-</button>

      {/* Row 4 */}
      <button className="btn btn-num" onClick={() => onDigit('1')}>1</button>
      <button className="btn btn-num" onClick={() => onDigit('2')}>2</button>
      <button className="btn btn-num" onClick={() => onDigit('3')}>3</button>
      <button className="btn btn-op" onClick={() => onOperator('+')} title="Add (+)">+</button>

      {/* Row 5 */}
      <button className="btn btn-fn" onClick={() => onUnary('sqrt')} title="Square Root">√</button>
      <button className="btn btn-num" onClick={() => onDigit('0')}>0</button>
      <button className="btn btn-num" onClick={() => onDigit('.')} title="Decimal (.)">.</button>
      <button className="btn btn-op" onClick={() => onUnary('%')} title="Percentage (%)">%</button>

      {/* Row 6 */}
      <button className="btn btn-op" onClick={() => onOperator('^')} title="Power (x^y)">xʸ</button>
      <button className="btn btn-fn" onClick={() => onUnary('negate')} title="Negate">±</button>
      <button className="btn btn-eq" onClick={onEqual} title="Calculate (= or Enter)">=</button>
    </div>
  );
}
