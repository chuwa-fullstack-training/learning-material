import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import './styles/global.css';
import styles from './App.module.css';

function Header() {
  const { state, dispatch } = useTheme();
  return (
    <div className={styles.header}>
      <h1>ReelTalk</h1>
      <button type="button" className={styles.themeToggle} onClick={() => dispatch({ type: 'TOGGLE' })}>
        {state.theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
      </button>
    </div>
  );
}

export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <div className={styles.app}>
          <Header />
          <div className={styles.layout}>
            <MovieList selectedMovieId={selectedMovieId} onSelect={setSelectedMovieId} />
            <MovieDetail movieId={selectedMovieId} />
          </div>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
}
