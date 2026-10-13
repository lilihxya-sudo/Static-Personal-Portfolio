const frame = document.getElementById('interactive-portfolio');
const origin = location.origin;
if (location.hash.startsWith('#interactive-')) history.scrollRestoration = 'manual';
let previousHeight = 0;
function sendViewport() {
  frame.contentWindow?.postMessage({ type: 'portfolio-viewport', height: innerHeight }, origin);
}
function followHash() {
  const id = location.hash.replace(/^#interactive-/, '');
  if (location.hash.startsWith('#interactive-') && id !== 'portfolio') {
    frame.loading = 'eager';
    frame.contentWindow?.postMessage({ type: 'portfolio-goto', id }, origin);
  }
}
window.addEventListener('message', event => {
  if (event.origin !== origin || event.source !== frame.contentWindow) return;
  const data = event.data;
  if (data?.type === 'portfolio-height' && Number.isFinite(data.height) && data.height > 0 && data.height < 1000000) {
    const height = Math.ceil(data.height);
    if (height !== previousHeight) { frame.style.height = `${height}px`; previousHeight = height; }
  }
  if (data?.type === 'portfolio-ready') { sendViewport(); followHash(); }
  if (data?.type === 'portfolio-navigate' && Number.isFinite(data.top) && /^[\w-]+$/.test(data.id)) {
    if (location.hash !== `#interactive-${data.id}`) history.pushState(null, '', `#interactive-${data.id}`);
    window.scrollTo({ top: frame.getBoundingClientRect().top + scrollY + data.top, behavior: data.restoring || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
});
window.addEventListener('resize', sendViewport);
window.addEventListener('hashchange', followHash);
frame.addEventListener('load', sendViewport);
window.addEventListener('load', followHash);
followHash();
