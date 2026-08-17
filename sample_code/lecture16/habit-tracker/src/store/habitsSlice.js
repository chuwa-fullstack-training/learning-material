import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits as fetchHabitsApi } from '../api/fetchHabits';
import { todayKey } from '../utils/date';

// Async thunk: same fetchHabits() mock API as L15, now dispatched through
// Redux instead of a component-local useEffect. Whichever route mounts
// first triggers this; every other route reads the same cached result.
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async (_, { signal }) => {
  return fetchHabitsApi({ signal });
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // RTK's Immer integration: this LOOKS like a mutation, but Immer
    // produces a new `items` array under the hood. Crucially, it only
    // creates a new object for the habit that changed — every other habit
    // in the array keeps its exact previous object reference. That's the
    // same "unaffected siblings keep their identity" property we hand-wrote
    // in L15's HabitsLayout with `.map(...)`; RTK gives it to us for free.
    checkIn(state, action) {
      const habitId = action.payload;
      const habit = state.items.find((h) => h.id === habitId);
      if (habit && !habit.checkIns.includes(todayKey())) {
        habit.checkIns.push(todayKey());
      }
    },
  },
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
        state.error = action.error.message;
      });
  },
});

export const { checkIn } = habitsSlice.actions;
export default habitsSlice.reducer;
