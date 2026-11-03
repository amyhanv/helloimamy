// main.js — scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
});

// Cursor-driven "lava lamp": the illustration inside the hero letters
// follows the pointer, eased so it glides rather than snaps.
(() => {
  const title = document.querySelector('.hero__title');
  if (!title) return;
  if (!window.matchMedia('(hover: hover)').matches) return;            // touch: CSS drift instead
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cur = { x: 50, y: 40, z: 150 };
  const target = { x: 50, y: 40, z: 150 };

  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth) * 100;
    target.y = (e.clientY / window.innerHeight) * 100;
    // pointer nearer the centre → a touch more zoomed in
    const d = Math.hypot(target.x - 50, target.y - 50) / 70;
    target.z = 165 - Math.min(d, 1) * 30;
  }, { passive: true });

  const tick = () => {
    // constant-speed glide (no slow-in/slow-out), capped per frame
    const step = (a, b, max) => a + Math.max(-max, Math.min(max, b - a));
    cur.x = step(cur.x, target.x, 0.22);
    cur.y = step(cur.y, target.y, 0.22);
    cur.z = step(cur.z, target.z, 0.12);
    title.style.setProperty('--mx', cur.x.toFixed(2));
    title.style.setProperty('--my', cur.y.toFixed(2));
    title.style.setProperty('--mz', cur.z.toFixed(2));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
