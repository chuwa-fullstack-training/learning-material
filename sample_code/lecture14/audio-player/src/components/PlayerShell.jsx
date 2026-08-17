// Generic card layout — knows nothing about audio players. Anything can be
// placed inside it via `children`, the same "slot" pattern from the Card
// example in slides (Lecture 14: Component Composition).
export default function PlayerShell({ children }) {
  return <div className="player">{children}</div>;
}
