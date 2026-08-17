# PodWave — L14: Audio Player (v0.2)

Course demo App A for Lecture 14 (Custom Hooks & Component Composition), continuing from `sample_code/lecture13/audio-player` (v0.1). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

App A ends here — Lecture 15 starts a brand-new app (App B, `sample_code/lecture15/habit-tracker`).

## Run it

```bash
cd sample_code/lecture14/audio-player
npm install
npm run dev
```

## What changed since Lecture 13

- **Custom Hook (`src/hooks/useAudioPlayer.js`)**: all the `audioRef` wiring, playback state, and `play`/`pause`/`seek`/volume logic that used to live directly in `Player.jsx` is now extracted into `useAudioPlayer(track)`. Compare this file to lecture13's `Player.jsx` side-by-side — same logic, reusable and testable independent of any component.
- **Composition (`children` / named slots)**: `PlayerShell` (`src/components/PlayerShell.jsx`) is a generic card layout that only knows about `children` — it has no idea it's rendering an audio player. `Player.jsx` composes `AlbumArt`, `TrackInfo`, and `PlayerControls` inside it, mirroring the `Card`/`Layout` composition pattern from the slides.
- **Error Boundary (`src/components/PlayerErrorBoundary.jsx`)**: wraps `<Player>`. `TrackInfo.jsx` has **no defensive check** on `track.tags` — track id 5 in `src/data/tracks.js` intentionally omits `tags` to simulate corrupted API data, which throws a real render-time error. Select that track in the UI to see the fallback UI. The boundary is keyed by `track.id` in `App.jsx` so switching to a different track after a crash recovers cleanly.

Note: an Error Boundary catches render/lifecycle errors, not resource-loading failures — a bad `audioUrl` (e.g. 404) does **not** trigger it. That's handled separately via normal `<audio>` error events / component state, not shown in this lecture's scope.

## Data source

Same as Lecture 13: local mock track metadata (`src/data/tracks.js`), external free audio ([SoundHelix](https://www.soundhelix.com/audio-examples)) and cover art ([Picsum](https://picsum.photos/)). No assets bundled in this repo.
