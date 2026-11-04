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

// Contact details are never written in the HTML. They're assembled in the
// browser from encoded pieces, so scrapers that only read markup don't see them.
document.addEventListener('DOMContentLoaded', () => {
  const parts = ['YW15LmhhbnZA', 'Z21haWwuY29t'];
  const address = () => atob(parts.join(''));

  const link = document.getElementById('email-link');
  if (link) {
    const reveal = () => { link.href = 'mail' + 'to:' + address(); };
    // only fill the link in once a person interacts with it
    ['pointerenter', 'focus', 'touchstart'].forEach((ev) => link.addEventListener(ev, reveal, { once: true }));
    link.addEventListener('click', reveal);
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

// Projects start collapsed; the section header or the nav link opens them.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('projects-toggle');
  const panel = document.getElementById('projects-panel');
  if (!toggle || !panel) return;

  const set = (open) => {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => set(!panel.classList.contains('open')));
  document.getElementById('nav-projects')?.addEventListener('click', () => set(true));
  if (location.hash === '#projects') set(true);
});

// Fun little extra: the illustration in "get in touch" can be dragged anywhere on
// the page. It tilts with how fast you fling it, and the page scrolls along when
// you drag near the top or bottom edge of the window.
document.addEventListener('DOMContentLoaded', () => {
  const art = document.getElementById('drag-art');
  if (!art) return;

  let x = 0, y = 0;                       // current offset from the art's home position
  let cx = 0, cy = 0, gx = 0, gy = 0;     // pointer (viewport) + where we grabbed it
  let bounds = null, lastX = 0, tilt = 0, dragging = false, raf = 0;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const apply = () => { art.style.translate = `${x}px ${y}px`; };

  const update = () => {
    x = clamp(cx + scrollX - gx, bounds.minX, bounds.maxX);
    y = clamp(cy + scrollY - gy, bounds.minY, bounds.maxY);
    apply();
  };

  const loop = () => {
    if (!dragging) return;
    const edge = 70, speed = 14;
    if (cy < edge) scrollBy({ top: -speed, behavior: 'instant' });
    else if (cy > innerHeight - edge) scrollBy({ top: speed, behavior: 'instant' });
    update();
    raf = requestAnimationFrame(loop);
  };

  art.addEventListener('pointerdown', (e) => {
    dragging = true;
    art.setPointerCapture(e.pointerId);
    art.classList.add('dragging');
    cx = e.clientX; cy = e.clientY; lastX = cx;
    gx = cx + scrollX - x; gy = cy + scrollY - y;
    // where the art sits with no offset, in page coordinates → keeps it on the page
    const r = art.getBoundingClientRect();
    const homeX = r.left + scrollX - x, homeY = r.top + scrollY - y;
    const pageW = document.documentElement.clientWidth, pageH = document.documentElement.scrollHeight;
    bounds = { minX: -homeX, maxX: pageW - r.width - homeX, minY: -homeY, maxY: pageH - r.height - homeY };
    e.preventDefault();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  });

  art.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    cx = e.clientX; cy = e.clientY;
    tilt += (clamp((cx - lastX) * 0.6, -8, 8) - tilt) * 0.3;
    lastX = cx;
    art.style.rotate = `${tilt}deg`;
  });

  const end = () => {
    if (!dragging) return;
    dragging = false; tilt = 0;
    cancelAnimationFrame(raf);
    art.classList.remove('dragging');
    art.style.rotate = '';                // eases back to level
  };
  art.addEventListener('pointerup', end);
  art.addEventListener('pointercancel', end);

  window.addEventListener('resize', () => { x = 0; y = 0; apply(); });
});
