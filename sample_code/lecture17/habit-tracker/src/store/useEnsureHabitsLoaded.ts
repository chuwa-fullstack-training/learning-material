import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchHabits } from './habitsSlice';

export default function useEnsureHabitsLoaded(): void {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.habits.status);

  useEffect(() => {
    if (status !== 'idle') return undefined;

    const promise = dispatch(fetchHabits());
    return () => promise.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
