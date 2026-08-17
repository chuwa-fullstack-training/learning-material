// Mock track catalog. Audio files are external free test files (SoundHelix),
// cover art is generated via the Picsum placeholder image service.
// No audio/image assets are bundled in this repo.
//
// `tags` powers TrackInfo's genre chips. Track 5 is intentionally missing
// `tags` to simulate corrupted API data — used in this lecture to trigger a
// real render-time error for the Error Boundary demo (see TrackInfo.jsx).
export const TRACKS = [
  {
    id: 1,
    title: 'Interstellar Drift',
    artist: 'Nova Radio',
    duration: 300,
    tags: ['ambient', 'space'],
    coverUrl: 'https://picsum.photos/seed/podwave-1/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Midnight Circuit',
    artist: 'Nova Radio',
    duration: 320,
    tags: ['synthwave', 'night'],
    coverUrl: 'https://picsum.photos/seed/podwave-2/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Analog Sunrise',
    artist: 'Deep End',
    duration: 280,
    tags: ['lo-fi', 'morning'],
    coverUrl: 'https://picsum.photos/seed/podwave-3/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 4,
    title: 'Glass Horizon',
    artist: 'Deep End',
    duration: 340,
    tags: ['ambient', 'chill'],
    coverUrl: 'https://picsum.photos/seed/podwave-4/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 5,
    title: 'Corrupted Entry (demo)',
    artist: 'Deep End',
    duration: 260,
    // tags intentionally omitted — simulates bad API data, crashes TrackInfo on render
    coverUrl: 'https://picsum.photos/seed/podwave-5/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];
