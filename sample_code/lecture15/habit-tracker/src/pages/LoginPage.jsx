import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../auth/session';

// Mock login: any non-empty username logs you in. There's no backend here
// until L17 — the point of this page is Protected Routes + redirect-back,
// not authentication itself.
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? '/habits';

  function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim()) return;
    login(username.trim());
    navigate(from, { replace: true });
  }

  return (
    <div className="login-page">
      <h1>StreakUp</h1>
      <p>Log in to track your habits.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Any username works"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
