# PodWave — L13: Audio Player (v0.1)

Course demo App A for Lecture 13 (Side Effects, Refs & Data Fetching). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

This is the **starting point** of App A. Lecture 14 continues from this code (`sample_code/lecture14/audio-player`), refactoring it into a custom Hook + composed components + an Error Boundary.

## Run it

```bash
cd sample_code/lecture13/audio-player
npm install
npm run dev
```

## What this demonstrates

- **Data fetching pattern** (`src/App.jsx`): `useEffect` + loading/error state, with `AbortController` cancellation on unmount. `src/api/fetchTracks.js` simulates a network call over a local mock catalog (`src/data/tracks.js`) — no backend required.
- **`useRef` for real DOM access** (`src/components/Player.jsx`): the `<audio>` element is a native, imperative API (`play()`, `pause()`, `currentTime`). `audioRef` is the direct handle to it — the canonical case where React state alone isn't enough.
- **`useEffect` re-sync on prop change**: switching tracks (`track.id` changes) reloads the `<audio>` element and resets playback state.
- **Controlled inputs**: the seek bar and volume slider are controlled by React state and write back into the `<audio>` DOM node.

## Data source

Track metadata is a local mock array. Audio files and cover art are **external free resources**, not bundled in this repo:

- Audio: [SoundHelix](https://www.soundhelix.com/audio-examples) public test MP3s.
- Covers: [Picsum](https://picsum.photos/) placeholder images (seeded per track for stable images).
