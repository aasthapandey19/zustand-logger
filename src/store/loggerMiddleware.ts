import type { StateCreator } from 'zustand';

type LogEntry<T> = {
  timestamp: string;
  prevState: T;
  nextState: T;
};

export function loggerMiddleware<T>(
  config: StateCreator<T>
): StateCreator<T> {
  return (set, get, api) => {
    return config(
      (args) => {
        const prevState = get();
        set(args); // apply the original update
        const nextState = get();

        const logEntry: LogEntry<T> = {
          timestamp: new Date().toISOString(),
          prevState,
          nextState,
        };

        console.groupCollapsed('%c🪵 Zustand Logger', 'color: #00c7b7; font-weight: bold;');
        console.log('Previous State:', prevState);
        console.log('Next State:', nextState);
        console.groupEnd();

        // Persist to localStorage
        const existingLogs = JSON.parse(localStorage.getItem('zustand-logs') || '[]');
        localStorage.setItem(
          'zustand-logs',
          JSON.stringify([...existingLogs, logEntry])
        );
      },
      get,
      api
    );
  };
}
