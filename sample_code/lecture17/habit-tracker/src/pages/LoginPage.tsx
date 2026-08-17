import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginRequest, registerRequest } from '../api/habits';
import { setToken } from '../auth/session';
import { ApiError } from '../api/client';

// Real auth now — the mock "any username works" login from L15/L16 is gone.
// New accounts need /auth/register once; existing ones use /auth/login.
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/habits';

  async function handleAuth(request: (u: string, p: string) => Promise<{ token: string }>) {
    setError(null);
    try {
      const { token } = await request(username, password);
      setToken(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    handleAuth(loginRequest);
  }

  return (
    <div className="login-page">
      <h1>StreakUp</h1>
      <p>Log in or create an account to track your habits.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log in</button>
        <button type="button" onClick={() => handleAuth(registerRequest)}>
          Register
        </button>
      </form>
      {error && <p className="login-page__error">{error}</p>}
    </div>
  );
}
