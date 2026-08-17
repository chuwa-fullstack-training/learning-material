import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import useEnsureHabitsLoaded from '../store/useEnsureHabitsLoaded';
import Navbar from '../components/Navbar';

// Compare to L15: this used to own `habits` state directly (useState +
// useEffect + AbortController) and hand it down via Outlet context. Now the
// habits live in the Redux store instead — this component's only job is to
// make sure they're loaded, then render the shared chrome + child route.
export default function HabitsLayout() {
  useEnsureHabitsLoaded();
  const status = useSelector((state) => state.habits.status);
  const error = useSelector((state) => state.habits.error);

  return (
    <div className="app">
      <Navbar />
      {status === 'loading' && <p>Loading habits...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && <Outlet />}
    </div>
  );
}
