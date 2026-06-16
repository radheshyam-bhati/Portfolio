import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to find the root element required to mount the application.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
