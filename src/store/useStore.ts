import { create } from 'zustand';
import { loggerMiddleware } from './loggerMiddleware';

type State = {
  count: number;
  increase: () => void;
  decrease: () => void;
};

export const useStore = create<State>(
  loggerMiddleware((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
  }))
);
