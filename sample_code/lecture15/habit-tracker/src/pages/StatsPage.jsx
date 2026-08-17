import { useEffect, useMemo, useState } from 'react';
import { fetchHabits } from '../api/fetchHabits';
import { computeStreak } from '../utils/streak';

// This route is a SIBLING of /habits, not nested under HabitsLayout, so it
// can't read the habits state shared via Outlet context — it fetches its
// own independent copy. Try this: check in a habit on /habits, then come
// here. The check-in won't be reflected, because this is a separate copy of
// the data that never heard about it. That gap — the same data needed in
// two places with no shared source of truth — is exactly the problem L16
// solves with Redux.
export default function StatsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unrelated UI state, used below to prove useMemo actually skips work.
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchHabits({ signal: controller.signal }).then((data) => {
      setHabits(data);
      setLoading(false);
    });
    return () => controller.abort();
  }, []);

  // Deliberately "expensive": recomputing streaks for every habit on every
  // render would be wasteful if it ran on every keystroke elsewhere in the
  // app. useMemo ties this to [habits] only — toggling `expanded` below
  // re-renders the component but should NOT log a recompute.
  const stats = useMemo(() => {
    console.log('Recomputing stats...');
    const streaks = habits.map((habit) => computeStreak(habit.checkIns));
    const longest = streaks.length ? Math.max(...streaks) : 0;
    const average = streaks.length ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0;
    return { longest, average: average.toFixed(1), total: habits.length };
  }, [habits]);

  if (loading) return <p>Loading stats...</p>;

  return (
    <div className="stats-page">
      <h1>Stats</h1>
      <p>Total habits: {stats.total}</p>
      <p>Longest current streak: 🔥 {stats.longest} days</p>
      <p>Average streak: {stats.average} days</p>

      <button type="button" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? 'Hide' : 'Show'} raw data
      </button>
      {/* Toggling this re-renders StatsPage without changing `habits` —
          check the console: "Recomputing stats..." should NOT log again. */}
      {expanded && <pre>{JSON.stringify(habits, null, 2)}</pre>}
    </div>
  );
}
