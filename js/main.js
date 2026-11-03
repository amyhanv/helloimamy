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
  const title = document.querySelector('.hero');
  if (!title) return;
  if (!window.matchMedia('(hover: hover)').matches) return;            // touch: CSS drift instead
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cur = { x: 50, y: 40, z: 150 };
  const target = { x: 50, y: 40, z: 150 };
  const vel = { x: 0, y: 0, z: 0 };

  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth) * 100;
    target.y = (e.clientY / window.innerHeight) * 100;
    // pointer nearer the centre → a touch more zoomed in
    const d = Math.hypot(target.x - 50, target.y - 50) / 70;
    target.z = 165 - Math.min(d, 1) * 30;
  }, { passive: true });

  const tick = () => {
    // soft spring: eases in and out, with a little inertia
    for (const k of ['x', 'y', 'z']) {
      vel[k] += (target[k] - cur[k]) * 0.0016;
      vel[k] *= 0.93;
      cur[k] += vel[k];
    }
    title.style.setProperty('--mx', cur.x.toFixed(2));
    title.style.setProperty('--my', cur.y.toFixed(2));
    title.style.setProperty('--mz', cur.z.toFixed(2));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
