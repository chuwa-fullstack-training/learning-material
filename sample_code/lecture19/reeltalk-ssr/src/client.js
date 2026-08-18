import { createElement as h } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { MovieDetailView } from './MovieDetailView.js';

// Same component, same props (window.__INITIAL_DATA__ IS what server.js
// fetched and embedded) — hydrateRoot attaches event handlers to the
// existing server-rendered DOM instead of throwing it away and rendering
// from scratch. No fetch() call here; that's the whole point.
const movie = window.__INITIAL_DATA__;
hydrateRoot(document.getElementById('root'), h(MovieDetailView, { movie }));
