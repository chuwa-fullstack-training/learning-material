import { useEffect, useState } from 'react';
import { fetchTracks } from './api/fetchTracks';
import TrackList from './components/TrackList';
import Player from './components/Player';
import PlayerErrorBoundary from './components/PlayerErrorBoundary';
import './styles.css';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetchTracks({ signal: controller.signal })
      .then((data) => {
        setTracks(data);
        setCurrentTrackId(data[0]?.id ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading tracks...</p>;
  if (error) return <p>Error: {error}</p>;

  const currentTrack = tracks.find((track) => track.id === currentTrackId);

  return (
    <div className="app">
      <h1>PodWave</h1>
      {currentTrack && (
        // `key={currentTrack.id}` remounts the boundary (and resets hasError)
        // whenever the selected track changes, so picking a different track
        // after a crash doesn't stay stuck on the fallback UI.
        <PlayerErrorBoundary key={currentTrack.id}>
          <Player track={currentTrack} />
        </PlayerErrorBoundary>
      )}
      <TrackList
        tracks={tracks}
        currentTrackId={currentTrackId}
        onSelectTrack={setCurrentTrackId}
      />
    </div>
  );
}
