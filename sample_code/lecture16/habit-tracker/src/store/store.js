import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './habitsSlice';

// configureStore wires up Redux DevTools automatically in development —
// open the Redux DevTools browser extension to time-travel through every
// checkIn/fetchHabits action dispatched below.
export const store = configureStore({
  reducer: {
    habits: habitsReducer,
  },
});
