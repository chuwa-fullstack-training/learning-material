export default function TrackInfo({ track }) {
  return (
    <div className="player__info">
      <h2>{track.title}</h2>
      <p>{track.artist}</p>
      {/* No defensive check on purpose: a track missing `tags` (see track id 5
          in data/tracks.js) throws here during render, which is what Error
          Boundaries are designed to catch. */}
      <p className="player__tags">
        {track.tags.map((tag) => (
          <span key={tag} className="player__tag">
            {tag}
          </span>
        ))}
      </p>
    </div>
  );
}
