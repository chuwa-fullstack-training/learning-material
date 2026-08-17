import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ViewPreferencesProvider } from '../context/ViewPreferencesContext';
import { createTestStore } from './testStore';
import type { RootState } from '../store/store';

interface RenderOptions {
  preloadedState?: PreloadedState<RootState>;
  route?: string;
}

// Wraps a component with the same providers App.tsx does (Redux + Context +
// Router), so tests exercise components the way they actually run.
export function renderWithProviders(ui: ReactElement, { preloadedState, route = '/' }: RenderOptions = {}) {
  const store = createTestStore(preloadedState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <ViewPreferencesProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ViewPreferencesProvider>
      </Provider>,
    ),
  };
}
