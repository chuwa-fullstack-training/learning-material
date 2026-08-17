import { formatTime } from '../formatTime';

export default function TrackList({ tracks, currentTrackId, onSelectTrack }) {
  return (
    <ul className="track-list">
      {tracks.map((track) => (
        <li
          key={track.id}
          className={track.id === currentTrackId ? 'track-list__item active' : 'track-list__item'}
        >
          <button type="button" onClick={() => onSelectTrack(track.id)}>
            <img src={track.coverUrl} alt="" width={48} height={48} />
            <span>
              <strong>{track.title}</strong>
              <br />
              {track.artist} · {formatTime(track.duration)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
