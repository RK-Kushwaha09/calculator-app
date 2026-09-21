import React, { useState, useEffect, useCallback } from 'react';
import Display from './Display.jsx';
import Keypad from './Keypad.jsx';
import { calculate } from '../services/api.js';

export default function Calculator({ onCalculationComplete, selectedResult }) {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [expressionDisplay, setExpressionDisplay] = useState('');
  const [isNewInput, setIsNewInput] = useState(false);
  const [error, setError] = useState(null);

  // If user clicks a result from HistoryPanel, set it to the calculator
  useEffect(() => {
    if (selectedResult !== null && selectedResult !== undefined) {
      setCurrentValue(String(selectedResult));
      setPreviousValue(null);
      setOperator(null);
      setExpressionDisplay(`Result: ${selectedResult}`);
      setIsNewInput(true);
      setError(null);
    }
  }, [selectedResult]);

  const handleDigit = useCallback((digit) => {
    setError(null);
    if (digit === '.') {
      if (isNewInput) {
        setCurrentValue('0.');
        setIsNewInput(false);
        return;
      }
      if (!currentValue.includes('.')) {
        setCurrentValue((prev) => prev + '.');
      }
      return;
    }

    if (currentValue === '0' || isNewInput) {
      setCurrentValue(digit);
      setIsNewInput(false);
    } else {
      setCurrentValue((prev) => prev + digit);
    }
  }, [currentValue, isNewInput]);

  const handleOperator = useCallback((nextOp) => {
    setError(null);
    const num = parseFloat(currentValue);

    if (previousValue === null) {
      setPreviousValue(num);
      setOperator(nextOp);
      setExpressionDisplay(`${num} ${formatOp(nextOp)}`);
      setIsNewInput(true);
    } else if (operator && !isNewInput) {
      // Chain calculation: calculate previous then set new operator
      executeCalculation(previousValue, operator, num, nextOp);
    } else {
      // User just wants to change the operator
      setOperator(nextOp);
      setExpressionDisplay(`${previousValue} ${formatOp(nextOp)}`);
    }
  }, [currentValue, previousValue, operator, isNewInput]);

  const executeCalculation = async (a, op, b, nextOp = null) => {
    try {
      setError(null);
      const data = await calculate(a, op, b);
      if (data.success) {
        setCurrentValue(String(data.result));
        if (nextOp) {
          setPreviousValue(data.result);
          setOperator(nextOp);
          setExpressionDisplay(`${data.result} ${formatOp(nextOp)}`);
        } else {
          setPreviousValue(null);
          setOperator(null);
          setExpressionDisplay(`${data.expression} =`);
        }
        setIsNewInput(true);
        if (onCalculationComplete) {
          onCalculationComplete();
        }
      } else {
        setError(data.message || 'Error');
        setIsNewInput(true);
      }
    } catch (err) {
      setError(err.message || 'Server Connection Failed');
      setIsNewInput(true);
    }
  };

  const handleEqual = useCallback(() => {
    if (previousValue !== null && operator !== null) {
      const b = parseFloat(currentValue);
      executeCalculation(previousValue, operator, b);
    }
  }, [previousValue, operator, currentValue]);

  const handleUnary = useCallback(async (action) => {
    setError(null);
    const num = parseFloat(currentValue);

    if (action === 'negate') {
      setCurrentValue(String(-num));
      return;
    }

    if (action === 'sqrt') {
      if (num < 0) {
        setError('Invalid input');
        return;
      }
      try {
        const data = await calculate(num, 'sqrt', null);
        if (data.success) {
          setCurrentValue(String(data.result));
          setExpressionDisplay(`√(${num}) =`);
          setIsNewInput(true);
          if (onCalculationComplete) onCalculationComplete();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message || 'Error');
      }
    } else if (action === '%') {
      try {
        const data = await calculate(num, '%', null);
        if (data.success) {
          setCurrentValue(String(data.result));
          setExpressionDisplay(`${num}% =`);
          setIsNewInput(true);
          if (onCalculationComplete) onCalculationComplete();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message || 'Error');
      }
    }
  }, [currentValue, onCalculationComplete]);

  const handleClear = useCallback(() => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setExpressionDisplay('');
    setError(null);
    setIsNewInput(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setCurrentValue('0');
    setError(null);
  }, []);

  const handleBackspace = useCallback(() => {
    if (isNewInput || error) return;
    if (currentValue.length > 1) {
      setCurrentValue((prev) => prev.slice(0, -1));
    } else {
      setCurrentValue('0');
    }
  }, [isNewInput, error, currentValue]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        handleOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleBackspace, handleClear]);

  const formatOp = (op) => {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    if (op === '^') return '^';
    return op;
  };

  return (
    <div className="calculator-card">
      <Display
        expression={expressionDisplay}
        value={currentValue}
        error={error}
      />
      <Keypad
        onDigit={handleDigit}
        onOperator={handleOperator}
        onEqual={handleEqual}
        onClear={handleClear}
        onClearEntry={handleClearEntry}
        onBackspace={handleBackspace}
        onUnary={handleUnary}
      />
    </div>
  );
}
