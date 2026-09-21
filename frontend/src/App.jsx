import React, { useState, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import { fetchHistory, clearHistoryApi, checkServerHealth } from './services/api.js';

export default function App() {
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('CHECKING');

  const loadHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.warn('Could not fetch history:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const res = await checkServerHealth();
      if (res.status === 'UP') {
        setServerStatus('ONLINE');
      } else {
        setServerStatus('OFFLINE');
      }
    } catch {
      setServerStatus('OFFLINE');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadHistory();
    const interval = setInterval(() => {
      checkHealth();
    }, 10000);
    return () => clearInterval(interval);
  }, [checkHealth, loadHistory]);

  const handleClearHistory = async () => {
    try {
      await clearHistoryApi();
      setHistory([]);
    } catch (err) {
      alert('Failed to clear history: ' + err.message);
    }
  };

  const handleSelectHistory = (result) => {
    setSelectedResult(result);
  };

  const handleCalculationComplete = () => {
    loadHistory();
    setServerStatus('ONLINE');
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="16" x2="16" y1="14" />
              <path d="M16 10h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M12 14h.01" />
              <path d="M8 14h.01" />
              <path d="M12 18h.01" />
              <path d="M8 18h.01" />
            </svg>
          </div>
          <div>
            <div className="brand-title">Cloud Calculator</div>
            <div className="brand-subtitle">React 18 • Java Spring Boot • MySQL 8</div>
          </div>
        </div>

        <div className="server-status">
          <span className={`status-dot ${serverStatus === 'ONLINE' ? 'online' : 'offline'}`} />
          <span>
            {serverStatus === 'ONLINE'
              ? 'Backend & MySQL Online'
              : serverStatus === 'CHECKING'
              ? 'Connecting...'
              : 'Backend Offline'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-container">
        <div>
          <Calculator
            onCalculationComplete={handleCalculationComplete}
            selectedResult={selectedResult}
          />

          {/* Educational Architecture Explanation */}
          <div className="education-banner">
            <div className="education-text">
              <h4>Architecture: How this runs in production</h4>
              <p>
                <span className="badge-pill">Client</span> Browser runs compiled React static files (HTML, JS, CSS).
                <br />
                <span className="badge-pill">API</span> Every calculation request is sent as JSON over HTTP to Java Spring Boot.
                <br />
                <span className="badge-pill">Database</span> Spring Data JPA persists calculation history into MySQL table <code>calculations</code>.
              </p>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div>
          <HistoryPanel
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
            isLoading={isLoadingHistory}
          />
        </div>
      </main>
    </div>
  );
}
