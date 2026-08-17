import { describe, expect, it, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import HabitListItem from './HabitListItem';
import { renderWithProviders } from '../test/renderWithProviders';
import { makeHabit, daysAgo } from '../test/fixtures';

// checkIn (an async thunk) calls the real API layer under the hood — mock
// it so tests never hit the network, per L17 slides' testing patterns.
vi.mock('../api/habits', () => ({
  checkInHabit: vi.fn(),
}));

import { checkInHabit } from '../api/habits';

describe('HabitListItem', () => {
  it('renders the habit name, category, and current streak', () => {
    const habit = makeHabit({ name: 'Drink Water', category: 'health', checkIns: [daysAgo(0), daysAgo(1)] });

    renderWithProviders(<HabitListItem habit={habit} />);

    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText(/🔥/)).toHaveTextContent('🔥 2');
  });

  it('dispatches checkIn and updates the store when the button is clicked', async () => {
    // HabitListItem only reads `habit` from props (it's rendered here in
    // isolation, not through HabitsListPage), so clicking "Check in" won't
    // change what THIS component displays — its props never change. What
    // it should do is dispatch the thunk and update the shared store, which
    // is what HabitsListPage would read from on its next render. Assert
    // against the store, not against this component's own DOM.
    const habit = makeHabit({ checkIns: [] });
    const updatedCheckIns = [daysAgo(0)];
    vi.mocked(checkInHabit).mockResolvedValueOnce({ checkIns: updatedCheckIns });

    const { store } = renderWithProviders(<HabitListItem habit={habit} />, {
      preloadedState: { habits: { items: [habit], status: 'succeeded', error: null } },
    });

    fireEvent.click(screen.getByRole('button', { name: /check in/i }));

    expect(checkInHabit).toHaveBeenCalledWith('h1');

    await waitFor(() => {
      expect(store.getState().habits.items[0].checkIns).toEqual(updatedCheckIns);
    });
  });
});
