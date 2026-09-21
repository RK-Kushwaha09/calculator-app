import React from 'react';

export default function HistoryPanel({ history, onSelectHistory, onClearHistory, isLoading }) {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="history-card">
      <div className="history-header">
        <div className="history-title">
          <span>Database History</span>
          <span className="history-badge">{history.length}</span>
        </div>
        {history.length > 0 && (
          <button
            className="btn-clear-history"
            onClick={onClearHistory}
            title="Clear all saved calculations from MySQL"
          >
            Clear
          </button>
        )}
      </div>

      <div className="history-list">
        {isLoading && <div className="history-empty">Loading history...</div>}

        {!isLoading && history.length === 0 && (
          <div className="history-empty">
            <p>No calculations yet.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#64748b' }}>
              Every calculation you perform is automatically stored in MySQL.
            </p>
          </div>
        )}

        {!isLoading &&
          history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => onSelectHistory(item.result)}
              title="Click to use this result"
            >
              <div className="history-expr">{item.expression} =</div>
              <div className="history-res">{item.result}</div>
              <div className="history-time">{formatTime(item.createdAt)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
