import { useStore } from './store/useStore';
import { useState } from 'react';

// ✅ Type for logs
type LogEntry<T> = {
  timestamp: string;
  prevState: T;
  nextState: T;
};

function App() {
  const count = useStore((state) => state.count);
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  const [logsVisible, setLogsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry<{ count: number }>[]>([]);

  const fetchLogs = () => {
    const stored = localStorage.getItem('zustand-logs');
    if (stored) {
      try {
        const parsed: LogEntry<{ count: number }>[] = JSON.parse(stored);
        setLogs(parsed.reverse());
        setLogsVisible(true);
      } catch {
        setLogs([]);
      }
    }
  };

  const clearLogs = () => {
    localStorage.removeItem('zustand-logs');
    setLogs([]);
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(logs.reverse(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'zustand-logs.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '10px' }}>Zustand Logger Test</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Count: {count}</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={increase} style={buttonStyle('#4caf50')}>
          Increase
        </button>
        <button onClick={decrease} style={buttonStyle('#f44336')}>
          Decrease
        </button>
        <button onClick={fetchLogs} style={buttonStyle('#2196f3')}>
          View Logs
        </button>
        <button onClick={clearLogs} style={buttonStyle('#9e9e9e')}>
          Clear Logs
        </button>
        <button onClick={exportLogs} style={buttonStyle('#ff9800')}>
          Export Logs
        </button>
      </div>

      {logsVisible && (
        <div
          style={{
            width: '80%',
            maxHeight: '40vh',
            overflowY: 'auto',
            backgroundColor: '#2e2e2e',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>🪵 Logs:</h3>
          {logs.length === 0 ? (
            <p>No logs found.</p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid #444',
                  marginBottom: '10px',
                  paddingBottom: '10px',
                }}
              >
                <div style={{ color: '#aaa', fontSize: '0.8rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                  <strong>Prev:</strong>{' '}
                  {JSON.stringify(log.prevState, null, 2)}
                  {'\n'}
                  <strong>Next:</strong>{' '}
                  {JSON.stringify(log.nextState, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function buttonStyle(bgColor: string): React.CSSProperties {
  return {
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: bgColor,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  };
}

export default App;
