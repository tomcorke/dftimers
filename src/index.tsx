import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

(() => {
  let dark = document.getElementsByTagName('html')[0].dataset.theme === 'dark';
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    dark = !dark;
    document.getElementsByTagName('html')[0].dataset.theme = dark
      ? 'dark'
      : 'light';
  });
})();
