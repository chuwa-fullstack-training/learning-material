import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth/session';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/habits">My Habits</Link>
      <Link to="/stats">Stats</Link>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </nav>
  );
}
