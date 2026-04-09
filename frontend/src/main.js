import './styles/main.css';
import { renderPortfolioApp } from './lib/renderApp.js';
import { initPortfolioInteractions } from './lib/interactions.js';

const appRoot = document.querySelector('#app');

if (!appRoot) {
  throw new Error('Missing #app mount node.');
}

appRoot.innerHTML = renderPortfolioApp();
initPortfolioInteractions();
