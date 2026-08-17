import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ViewPreferencesProvider } from './context/ViewPreferencesContext';
import LoginPage from './pages/LoginPage';
import HabitsLayout from './pages/HabitsLayout';
import HabitsListPage from './pages/HabitsListPage';
import HabitDetailPage from './pages/HabitDetailPage';
import ProtectedRoute from './auth/ProtectedRoute';
import './styles.css';

const StatsPage = lazy(() => import('./pages/StatsPage'));

export default function App() {
  return (
    <Provider store={store}>
      <ViewPreferencesProvider>
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
      </ViewPreferencesProvider>
    </Provider>
  );
}
