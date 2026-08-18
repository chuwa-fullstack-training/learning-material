import { createContext, useContext, useEffect, useReducer } from 'react';

// Same useReducer + Context pattern as App B's ViewPreferencesContext
// (sample_code/lecture16/habit-tracker) — a simple, synchronous UI
// preference read by several components, with no async data and no need
// for Redux. The interesting part here isn't the Context itself, it's
// what it controls: an HTML attribute, not component props.
const ThemeContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      throw new Error('Unknown action');
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { theme: 'dark' });

  // The actual theme switch happens here: setting a DOM attribute that
  // src/styles/tokens.css keys off of. No component re-renders because of
  // a color changing — every CSS Module below reads var(--color-*), and
  // the browser repaints them the instant this attribute changes. React
  // is not "doing" the theming; it's just the thing that flipped one
  // attribute.
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
