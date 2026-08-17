import { useMemo, useState } from 'react';
import { useAppSelector } from '../store/store';
import useEnsureHabitsLoaded from '../store/useEnsureHabitsLoaded';
import { computeStreak } from '../utils/streak';

export default function StatsPage() {
  useEnsureHabitsLoaded();
  const habits = useAppSelector((state) => state.habits.items);
  const status = useAppSelector((state) => state.habits.status);

  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    console.log('Recomputing stats...');
    const streaks = habits.map((habit) => computeStreak(habit.checkIns));
    const longest = streaks.length ? Math.max(...streaks) : 0;
    const average = streaks.length ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0;
    return { longest, average: average.toFixed(1), total: habits.length };
  }, [habits]);

  if (status === 'loading' || status === 'idle') return <p>Loading stats...</p>;

  return (
    <div className="stats-page">
      <h1>Stats</h1>
      <p>Total habits: {stats.total}</p>
      <p>Longest current streak: 🔥 {stats.longest} days</p>
      <p>Average streak: {stats.average} days</p>

      <button type="button" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? 'Hide' : 'Show'} raw data
      </button>
      {expanded && <pre>{JSON.stringify(habits, null, 2)}</pre>}
    </div>
  );
}
