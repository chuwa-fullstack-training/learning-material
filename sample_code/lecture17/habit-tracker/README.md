# StreakUp — L17: Habit Tracker (v0.3)

Course demo App B for Lecture 17 (Fullstack Integration + TypeScript React + Testing + AI Workflow), continuing from `sample_code/lecture16/habit-tracker` (v0.2). Pairs with the backend at `sample_code/lecture17/habit-tracker-api`. See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

App B ends here — this is the final version.

## Run it

You need both the backend and frontend running:

```bash
# Terminal 1
cd sample_code/lecture17/habit-tracker-api
npm install
cp .env.example .env   # fill in MONGODB_URI / JWT_SECRET
npm start               # http://localhost:4001

# Terminal 2
cd sample_code/lecture17/habit-tracker
npm install
npm run dev              # http://localhost:5173
```

Register a new account on the login page (there's no seed data — this is a real backend now).

## Run the tests

```bash
npm test          # single run
npm run test:watch # watch mode
```

Three tests, matching the three patterns from slides Part 3:
- **Render test** (`HabitListItem.spec.tsx`): habit name, category, and streak display correctly.
- **User interaction test** (`HabitListItem.spec.tsx`): clicking "Check in" dispatches the `checkIn` thunk and updates the store.
- **Async test** (`HabitsLayout.spec.tsx`): shows a loading state, then renders once the mocked fetch resolves (`findByText`, per slides' "Testing Async Components").

## What changed since Lecture 16

- **Real backend, not mock data**: `src/api/habits.ts` calls `habit-tracker-api` (`src/api/client.ts` is the centralized API service layer from slides, with a real `Authorization: Bearer <token>` header). `src/data/habits.js`'s mock catalog is gone.
- **`checkIn` becomes an async thunk**: in L16, checking in was a synchronous Immer reducer (instant, in-memory). Now it has to round-trip to the server first — `store/habitsSlice.ts`'s `checkIn` thunk calls the API, and the reducer only applies `action.payload.checkIns` once the request actually succeeds. This is a genuine behavior change, not just a syntax one: there's now real latency and a real failure mode (see `ApiError`) between clicking the button and the UI updating.
- **Real auth**: `LoginPage.tsx` calls `/auth/register` or `/auth/login` and stores the real JWT the backend returns (`src/auth/session.ts`). The old "any username works" mock login is gone.
- **TypeScript throughout**: `src/types.ts` defines `Habit`/`Category`; the Redux store, hooks (`useAppDispatch`/`useAppSelector` in `store/store.ts`), components, and API layer are all typed. Compare any file here to its L16 `.jsx` counterpart.
- **Tests**: see above. `src/test/renderWithProviders.tsx` wraps components in the same Redux + Context + Router providers `App.tsx` uses, and `src/test/testStore.ts` creates an isolated store per test so state never leaks between tests.

## API contract note

The backend's `GET /api/habits` response shape (`{ id, name, category, checkIns }`) deliberately matches what the L15/L16 mock data already looked like — see `habit-tracker-api/controllers/habits.js`. That's why the Redux slice's `items: Habit[]` shape and every component that reads it didn't need to change; only the fetch call underneath did.
