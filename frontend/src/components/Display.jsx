import React from 'react';

export default function Display({ expression, value, error }) {
  return (
    <div className="calculator-screen">
      <div className="screen-expression">
        {expression || '\u00A0'}
      </div>
      <div className={`screen-main ${error ? 'screen-error' : ''}`}>
        {error ? error : value}
      </div>
    </div>
  );
}
