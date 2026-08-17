# StreakUp — L15: Habit Tracker (v0.1)

Course demo App B for Lecture 15 (React Router + Performance Optimization). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

This is the **starting point** of App B. Lecture 16 continues from this code (`sample_code/lecture16/habit-tracker`), replacing the data-sharing gap described below with Redux.

## Run it

```bash
cd sample_code/lecture15/habit-tracker
npm install
npm run dev
```

Log in with any non-empty username (mock auth, no backend yet).

## What this demonstrates

- **React Router v6 setup + nested routes**: `/habits` (`HabitsLayout.jsx`) is a layout route rendering `<Navbar />` + `<Outlet />`; `/habits` (index) and `/habits/:id` are child routes rendered inside it.
- **Protected Routes** (`src/auth/ProtectedRoute.jsx`): `/habits` and `/stats` redirect to `/login` if there's no session token; after logging in you're sent back to the page you originally requested (`location.state.from`).
- **`useSearchParams`** (`HabitsListPage.jsx`): the category filter lives in the URL (`/habits?category=health`) — shareable and bookmarkable, not just component state.
- **Route-based code splitting** (`App.jsx`): `/stats` is loaded via `React.lazy` + `Suspense`, so its (heavier, chart-style) code doesn't ship until a user visits it.
- **`React.memo`** (`HabitListItem.jsx`): checking in one habit shouldn't re-render every other habit in the list. Open the console — clicking "Check in" on one item logs only that item's `Rendering HabitListItem: ...` line.
- **`useMemo`** (`StatsPage.jsx`): streak aggregation is memoized on `[habits]`. Toggle "Show raw data" (unrelated UI state) and watch the console — `Recomputing stats...` should NOT log again, proving the memoized computation was skipped.

## A gap left on purpose

`/stats` is a **sibling** route of `/habits`, not nested under `HabitsLayout` — it can't read the habits state shared via `Outlet` context, so `StatsPage.jsx` fetches its **own independent copy** of the habit data. Check in a habit on `/habits`, then visit `/stats`: the check-in won't be reflected there.

This isn't a bug to fix in this lecture — it's the motivating problem for Lecture 16 (state management). Once multiple distant routes genuinely need the same data, prop-drilling / Outlet context stops scaling, and that's exactly when Redux earns its complexity.

## Data source

All habit data is an in-memory mock (`src/data/habits.js`), with check-in dates generated relative to "today" so the demo always looks current. No backend involved until Lecture 17.
