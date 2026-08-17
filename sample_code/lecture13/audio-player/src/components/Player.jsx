import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../formatTime';

// v0.1 (Lecture 13): everything lives directly in this component.
// Lecture 14 will extract the state + DOM logic below into a `useAudioPlayer` hook.
export default function Player({ track }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // New track selected -> load it and (re)start playback.
  // useEffect syncing external system (the <audio> element) to the `track` prop.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setCurrentTime(0);
    setIsPlaying(false);
  }, [track.id]);

  // useRef DOM access: subscribe to native media events the <audio> element fires.
  // Cleanup removes the listeners on unmount / before the effect re-runs.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [track.id]);

  // Volume is React state driving an imperative property on the DOM node.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  // Seeking: React state (the range input) writes back into the DOM node.
  function handleSeek(event) {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <div className="player">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      <img className="player__cover" src={track.coverUrl} alt="" width={120} height={120} />

      <h2>{track.title}</h2>
      <p>{track.artist}</p>

      <button type="button" onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div className="player__progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
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
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
