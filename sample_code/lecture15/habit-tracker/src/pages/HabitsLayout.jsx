import { useEffect, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { fetchHabits } from '../api/fetchHabits';
import { todayKey } from '../utils/date';
import Navbar from '../components/Navbar';

// Shared layout for everything under /habits. Fetches the habit list once
// here and hands it down to child routes (HabitsListPage, HabitDetailPage)
// via Outlet's context — the nested-route equivalent of passing props, but
// without threading them through every level manually.
//
// Note: /stats is a SIBLING route, not nested under this layout, so it can't
// reach this state through Outlet context. It fetches its own independent
// copy (see StatsPage.jsx) — that gap is the real motivation for L16's move
// to Redux, not a contrived example.
export default function HabitsLayout() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetchHabits({ signal: controller.signal })
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Stable function reference (functional setState form needs no
  // dependencies), so React.memo on HabitListItem isn't defeated by a new
  // callback on every render.
  const handleCheckIn = useCallback((habitId) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, checkIns: [...habit.checkIns, todayKey()] }
          : habit, // unchanged habits keep the SAME object reference
      ),
    );
  }, []);

  return (
    <div className="app">
      <Navbar />
      {loading && <p>Loading habits...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && <Outlet context={{ habits, onCheckIn: handleCheckIn }} />}
    </div>
  );
}
