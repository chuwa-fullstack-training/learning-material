import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from './session';

// Redirects to /login when there's no token, remembering the page the user
// was trying to reach in `location.state.from` so login can send them back.
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
