import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './page';

function App() {
  React.useEffect(() => {
    if (window.parent !== window) window.parent.postMessage({ type: 'portfolio-ready' }, location.origin);
  }, []);
  return <Home />;
}
createRoot(document.getElementById('root')!).render(<App />);

// A same-origin, auto-height frame isolates the original portfolio's styles.
// Keep viewport-based sections sized to the visitor's window, not the full frame.
const embedded = window.parent !== window;
const sendHeight = () => {
  if (embedded) window.parent.postMessage({ type: 'portfolio-height', height: document.body.scrollHeight }, location.origin);
};
if (embedded) {
  const setViewport = (height: number) => document.documentElement.style.setProperty('--viewport-height', `${height}px`);
  setViewport(window.parent.innerHeight);
  new ResizeObserver(sendHeight).observe(document.body);
  window.addEventListener('message', async event => {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data?.type === 'portfolio-viewport') setViewport(event.data.height);
    if (event.data?.type === 'portfolio-goto') {
      const target = document.getElementById(event.data.id);
      if (target) {
        const earlierImages = [...document.images].filter(img => img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
        await Promise.all(earlierImages.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); }));
        sendHeight();
        requestAnimationFrame(() => window.parent.postMessage({ type: 'portfolio-navigate', id: target.id, top: target.getBoundingClientRect().top + window.scrollY, restoring: true }, location.origin));
      }
    }
  });
  document.addEventListener('click', event => {
    const link = (event.target as Element).closest('a[href^="#"]');
    const id = link?.getAttribute('href')?.slice(1);
    const target = id && document.getElementById(id);
    if (target) {
      event.preventDefault();
      window.parent.postMessage({ type: 'portfolio-navigate', id, top: target.getBoundingClientRect().top + window.scrollY }, location.origin);
    }
  });
  window.addEventListener('load', sendHeight);
} else {
  document.documentElement.style.setProperty('--viewport-height', '100svh');
}
