import { Link, useNavigate } from 'react-router-dom';
import { clearToken } from '../auth/session';
import { useViewPreferences } from '../context/ViewPreferencesContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useViewPreferences();

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/habits">My Habits</Link>
      <Link to="/stats">Stats</Link>
      <button type="button" onClick={() => dispatch({ type: 'TOGGLE_COMPACT' })}>
        Compact view: {state.compact ? 'On' : 'Off'}
      </button>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </nav>
  );
}
