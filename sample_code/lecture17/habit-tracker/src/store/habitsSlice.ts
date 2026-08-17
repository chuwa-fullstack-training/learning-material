import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits as fetchHabitsApi, checkInHabit as checkInHabitApi } from '../api/habits';
import type { Habit } from '../types';

interface HabitsState {
  items: Habit[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HabitsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  return fetchHabitsApi();
});

// Compare to L16: checking in used to be a synchronous reducer (Immer
// mutated the in-memory array directly). Now it has to persist server-side
// first, so it becomes an async thunk — the reducer only applies the
// server's response once the request succeeds.
export const checkIn = createAsyncThunk('habits/checkIn', async (habitId: string) => {
  const { checkIns } = await checkInHabitApi(habitId);
  return { habitId, checkIns };
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load habits';
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        const habit = state.items.find((h) => h.id === action.payload.habitId);
        if (habit) {
          habit.checkIns = action.payload.checkIns;
        }
      });
  },
});

export default habitsSlice.reducer;
