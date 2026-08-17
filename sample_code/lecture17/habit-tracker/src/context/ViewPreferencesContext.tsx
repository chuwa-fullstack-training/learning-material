import { createContext, useContext, useReducer, type ReactNode } from 'react';

interface ViewPreferencesState {
  compact: boolean;
}

type ViewPreferencesAction = { type: 'TOGGLE_COMPACT' };

interface ViewPreferencesContextValue {
  state: ViewPreferencesState;
  dispatch: (action: ViewPreferencesAction) => void;
}

const ViewPreferencesContext = createContext<ViewPreferencesContextValue | null>(null);

function reducer(state: ViewPreferencesState, action: ViewPreferencesAction): ViewPreferencesState {
  switch (action.type) {
    case 'TOGGLE_COMPACT':
      return { ...state, compact: !state.compact };
    default:
      throw new Error('Unknown action');
  }
}

export function ViewPreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { compact: false });
  return (
    <ViewPreferencesContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewPreferencesContext.Provider>
  );
}

export function useViewPreferences(): ViewPreferencesContextValue {
  const context = useContext(ViewPreferencesContext);
  if (!context) {
    throw new Error('useViewPreferences must be used within a ViewPreferencesProvider');
  }
  return context;
}
