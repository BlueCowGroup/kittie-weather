/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import './index.css';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed, app still works
    });
  });
}

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
}
