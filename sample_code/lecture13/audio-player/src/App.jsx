import { useEffect, useState } from 'react';
import { fetchTracks } from './api/fetchTracks';
import TrackList from './components/TrackList';
import Player from './components/Player';
import './styles.css';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  // Data fetching pattern: loading -> data / error, with cancellation on unmount.
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
      {currentTrack && <Player track={currentTrack} />}
      <TrackList
        tracks={tracks}
        currentTrackId={currentTrackId}
        onSelectTrack={setCurrentTrackId}
      />
    </div>
  );
}
