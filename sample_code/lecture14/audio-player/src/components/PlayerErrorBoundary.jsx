import React from 'react';

// Error Boundaries must be class components (no Hook equivalent exists yet).
// This one wraps the Player: if a track's data is malformed and a child
// throws during render (see TrackInfo.jsx + track id 5 in data/tracks.js),
// the fallback UI below is shown instead of taking down the whole app.
export default class PlayerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Player crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="player player--error">
          <p>This track couldn't be displayed.</p>
          <p className="player__error-detail">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
