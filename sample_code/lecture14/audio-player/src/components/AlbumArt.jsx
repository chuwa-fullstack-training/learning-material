export default function AlbumArt({ track }) {
  return <img className="player__cover" src={track.coverUrl} alt="" width={120} height={120} />;
}
