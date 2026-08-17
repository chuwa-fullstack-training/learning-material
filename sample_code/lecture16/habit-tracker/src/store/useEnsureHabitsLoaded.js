import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits } from './habitsSlice';

// Both HabitsLayout (/habits) and StatsPage (/stats) call this on mount.
// Only the first one to run actually dispatches the fetch — once status
// moves past 'idle', every other caller just reads the same cached state.
// This is what closes the L15 gap: there's now exactly one source of truth
// for habit data, shared by every route that needs it.
export default function useEnsureHabitsLoaded() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.habits.status);

  useEffect(() => {
    if (status !== 'idle') return undefined;

    const promise = dispatch(fetchHabits());
    return () => promise.abort();
    // Deliberately NOT depending on `status`: once the fetch starts, status
    // flips to 'loading', which would re-run this effect and immediately
    // abort the request it just dispatched. This should only ever fire once
    // per mount, based on whatever status was at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
