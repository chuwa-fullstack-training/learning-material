import useAudioPlayer from '../hooks/useAudioPlayer';
import PlayerShell from './PlayerShell';
import AlbumArt from './AlbumArt';
import TrackInfo from './TrackInfo';
import PlayerControls from './PlayerControls';

// v0.2 (Lecture 14): the imperative DOM/state logic that used to live directly
// in this component (see lecture13/audio-player/src/components/Player.jsx)
// is now behind `useAudioPlayer`. This component only wires Hook output to
// composed, single-purpose pieces (AlbumArt / TrackInfo / PlayerControls),
// laid out inside the reusable `PlayerShell` card via `children`.
export default function Player({ track }) {
  const { audioRef, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume } =
    useAudioPlayer(track);

  return (
    <PlayerShell>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />
      <AlbumArt track={track} />
      <TrackInfo track={track} />
      <PlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onTogglePlay={togglePlay}
        onSeek={seek}
        onVolumeChange={setVolume}
      />
    </PlayerShell>
  );
}
