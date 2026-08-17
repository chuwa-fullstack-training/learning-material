import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import habitsReducer from '../store/habitsSlice';
import type { RootState } from '../store/store';

// A fresh store per test — never import the app's singleton `store` in
// tests, or state from one test would leak into the next.
export function createTestStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: { habits: habitsReducer },
    preloadedState,
  });
}
