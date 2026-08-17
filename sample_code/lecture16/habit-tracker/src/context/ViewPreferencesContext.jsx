import { createContext, useContext, useReducer } from 'react';

// The lightweight counterpart to habitsSlice: a UI preference (compact
// layout) that several distant components read (Navbar, HabitsListPage),
// but that doesn't need async fetching, doesn't have many action types, and
// isn't really "domain data" — a textbook case for Context + useReducer
// instead of Redux. See slides "When to Use What?".
const ViewPreferencesContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_COMPACT':
      return { ...state, compact: !state.compact };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function ViewPreferencesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { compact: false });
  return (
    <ViewPreferencesContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewPreferencesContext.Provider>
  );
}

export function useViewPreferences() {
  const context = useContext(ViewPreferencesContext);
  if (!context) {
    throw new Error('useViewPreferences must be used within a ViewPreferencesProvider');
  }
  return context;
}
