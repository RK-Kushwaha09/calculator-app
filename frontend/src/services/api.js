// In production or when proxied by Vite/Nginx, relative URL '/api' routes properly.
// Can be overridden with VITE_API_BASE_URL (e.g. 'http://your-server-ip:8080/api')
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function calculate(operand1, operator, operand2) {
  try {
    const res = await fetch(`${API_BASE}/calculator/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operand1: Number(operand1),
        operator: operator,
        operand2: operand2 !== null && operand2 !== undefined ? Number(operand2) : null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Calculation error');
    }
    return data;
  } catch (err) {
    console.error('API calculate error:', err);
    throw err;
  }
}

export async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE}/calculator/history`);
    if (!res.ok) {
      throw new Error('Failed to fetch history');
    }
    return await res.json();
  } catch (err) {
    console.error('API fetchHistory error:', err);
    throw err;
  }
}

export async function clearHistoryApi() {
  try {
    const res = await fetch(`${API_BASE}/calculator/history`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to clear history');
    }
    return await res.json();
  } catch (err) {
    console.error('API clearHistory error:', err);
    throw err;
  }
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'DOWN' };
    return await res.json();
  } catch (err) {
    return { status: 'OFFLINE', error: err.message };
  }
}
