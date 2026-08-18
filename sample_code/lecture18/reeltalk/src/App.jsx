import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import './styles.css';

export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <h1>ReelTalk</h1>
        <div className="layout">
          <MovieList selectedMovieId={selectedMovieId} onSelect={setSelectedMovieId} />
          <MovieDetail movieId={selectedMovieId} />
        </div>
      </div>
    </ApolloProvider>
  );
}
