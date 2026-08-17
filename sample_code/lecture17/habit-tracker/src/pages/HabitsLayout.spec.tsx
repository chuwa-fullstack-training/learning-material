import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import HabitsLayout from './HabitsLayout';
import HabitsListPage from './HabitsListPage';
import { renderWithProviders } from '../test/renderWithProviders';
import { makeHabit } from '../test/fixtures';

vi.mock('../api/habits', () => ({
  fetchHabits: vi.fn(),
}));

import { fetchHabits } from '../api/habits';

describe('HabitsLayout (async loading)', () => {
  it('shows a loading state, then renders habits once the fetch resolves', async () => {
    vi.mocked(fetchHabits).mockResolvedValueOnce([makeHabit({ name: 'Drink Water' })]);

    renderWithProviders(
      <Routes>
        <Route path="/habits" element={<HabitsLayout />}>
          <Route index element={<HabitsListPage />} />
        </Route>
      </Routes>,
      { route: '/habits' },
    );

    expect(screen.getByText('Loading habits...')).toBeInTheDocument();

    // findBy* polls until the element appears — the async equivalent of
    // getBy*, needed here since the habit only shows up after the mocked
    // fetch resolves.
    expect(await screen.findByText('Drink Water')).toBeInTheDocument();
  });
});
