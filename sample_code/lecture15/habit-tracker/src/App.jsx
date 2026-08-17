import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HabitsLayout from './pages/HabitsLayout';
import HabitsListPage from './pages/HabitsListPage';
import HabitDetailPage from './pages/HabitDetailPage';
import ProtectedRoute from './auth/ProtectedRoute';
import './styles.css';

// Route-based code splitting: the charting/aggregation logic on Stats isn't
// needed until a user actually visits it, so it ships in its own chunk.
const StatsPage = lazy(() => import('./pages/StatsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/habits" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <HabitsLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HabitsListPage />} />
          <Route path=":id" element={<HabitDetailPage />} />
        </Route>

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading stats page...</p>}>
                <StatsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
