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

// Smooth, velocity-aware scrolling (Lenis) — inspired by neundex.com.
// Content softly blurs + stretches with scroll speed, and the contact
// illustration drifts inside its frame as you scroll past.
(() => {
  if (!window.Lenis) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  const fx = document.querySelectorAll('.hero__title, .about__lead, .about__cols, .contact__title, .contact__art');
  const art = document.querySelector('.contact__art');
  let v = 0;

  const frame = (t) => {
    lenis.raf(t);
    const target = Math.min(Math.abs(lenis.velocity), 50) / 50;   // 0 → 1
    v += (target - v) * 0.15;                                      // smooth the velocity itself
    fx.forEach((el) => {
      el.style.filter = v > 0.01 ? `blur(${(v * 3.2).toFixed(2)}px)` : '';
      el.style.scale = v > 0.01 ? `1 ${(1 + v * 0.05).toFixed(4)}` : '';
    });
    if (art) {
      const r = art.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / window.innerHeight;   // ~0 (below) → 1 (above)
      art.style.setProperty('--py', Math.max(0, Math.min(100, p * 100)).toFixed(1));
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // in-page links glide with Lenis instead of jumping
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(id === '#top' ? 0 : el, { offset: -40, duration: 1.4 });
    });
  });
})();
