import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to find the root element required to mount the application.');
}

// Global safety nets: log any uncaught error or rejected promise so the app
// never dies silently — and so a single bad API response can't take the site
// down. The ErrorBoundary below handles render crashes; these handlers cover
// async/event errors that React never sees.
window.addEventListener('error', (event) => {
  console.error('[window error]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandledrejection]', event.reason);
});

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
