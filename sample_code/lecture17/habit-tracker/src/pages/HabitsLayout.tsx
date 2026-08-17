import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import useEnsureHabitsLoaded from '../store/useEnsureHabitsLoaded';
import Navbar from '../components/Navbar';

export default function HabitsLayout() {
  useEnsureHabitsLoaded();
  const status = useAppSelector((state) => state.habits.status);
  const error = useAppSelector((state) => state.habits.error);

  return (
    <div className="app">
      <Navbar />
      {status === 'loading' && <p>Loading habits...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <Outlet />}
    </div>
  );
}
