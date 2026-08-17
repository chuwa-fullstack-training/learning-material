import { formatTime } from '../formatTime';

// Pure presentational component — receives everything as props from the
// `useAudioPlayer` Hook via Player.jsx. No Hook calls of its own.
export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onSeek,
  onVolumeChange,
}) {
  return (
    <div className="player__controls">
      <button type="button" onClick={onTogglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className="player__progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <label className="player__volume">
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
