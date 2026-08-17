# StreakUp — L16: Habit Tracker (v0.2)

Course demo App B for Lecture 16 (State Management), continuing from `sample_code/lecture15/habit-tracker` (v0.1). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

The generic Redux-principles demo referenced in slides (`redux-native.js`, `redux-rtk.js`) still lives at `sample_code/lecture16/` — this app picks up right after that, applying RTK to a real feature instead of a counter.

## Run it

```bash
cd sample_code/lecture16/habit-tracker
npm install
npm run dev
```

## What changed since Lecture 15

- **Redux Toolkit (`src/store/`)**: `habitsSlice.js` replaces the `useState`/`useEffect` fetch that used to live in `HabitsLayout.jsx`. `fetchHabits` is a `createAsyncThunk`; `checkIn` is a normal reducer — write "mutating" code, Immer produces the immutable update.
- **The L15 gap is closed**: check in a habit on `/habits`, then visit `/stats` — the numbers **do** reflect it now, because both routes read `state.habits.items` from the same store. Compare this to L15's README, which called out the opposite behavior on purpose.
- **One shared fetch, not two** (`src/store/useEnsureHabitsLoaded.js`): both `HabitsLayout` and `StatsPage` call this hook on mount. Whichever route the user visits first actually dispatches `fetchHabits`; the other just reads the already-loaded state.
- **`HabitListItem.jsx` gets simpler, not more complex**: it now dispatches `checkIn(habit.id)` directly via `useDispatch()` instead of receiving an `onCheckIn` callback prop from its parent. `useDispatch()` is always referentially stable, so `React.memo` still works — without anyone having to remember to wrap a callback in `useCallback`. Worth comparing side-by-side with L15's version.
- **Context API, for a genuinely different job** (`src/context/ViewPreferencesContext.jsx`): the "Compact view" toggle in the navbar is a `useReducer` + Context implementation — no async data, few actions, doesn't belong in the same store as habits/check-ins. `App.jsx` wraps the app in both `<Provider store={store}>` and `<ViewPreferencesProvider>` at once, on purpose: two tools, two different jobs, neither trying to do the other's.
- **Redux DevTools**: `configureStore` enables them automatically in development. Open the Redux DevTools browser extension and dispatch a `checkIn` — you can inspect and time-travel through every action.

## Data source

Same mock data as L15 (`src/data/habits.js`), fetched through the same `fetchHabits` mock API — just dispatched through a thunk instead of called directly in a component. Still no backend; that's L17.
