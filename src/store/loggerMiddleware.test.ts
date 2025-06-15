import { loggerMiddleware } from './loggerMiddleware';
import { createStore } from 'zustand/vanilla';

type State = {
  count: number;
  increase: () => void;
};

describe('loggerMiddleware', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should log state changes to localStorage', () => {
    const store = createStore(
      loggerMiddleware<State>((set) => ({
        count: 0,
        increase: () => set((state) => ({ count: state.count + 1 })),
      }))
    );

    store.getState().increase();

    const logs = JSON.parse(localStorage.getItem('zustand-logs') || '[]');
    expect(logs.length).toBe(1);
    expect(logs[0].prevState.count).toBe(0);
    expect(logs[0].nextState.count).toBe(1);
  });
});
