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

// Fun little extra: the illustration in "get in touch" can be dragged around
// (kept inside its section) and tilts with how fast you fling it.
document.addEventListener('DOMContentLoaded', () => {
  const art = document.getElementById('drag-art');
  const sec = document.getElementById('contact');
  if (!art || !sec) return;

  let x = 0, y = 0, sx = 0, sy = 0, bounds = null, lastX = 0, tilt = 0, dragging = false;

  const apply = () => { art.style.translate = `${x}px ${y}px`; };

  art.addEventListener('pointerdown', (e) => {
    dragging = true;
    art.setPointerCapture(e.pointerId);
    art.classList.add('dragging');
    sx = e.clientX - x; sy = e.clientY - y; lastX = e.clientX;
    // where the art would sit with no offset, so we can keep it inside the section
    const a = art.getBoundingClientRect(), s = sec.getBoundingClientRect();
    bounds = {
      minX: s.left - (a.left - x), maxX: s.right - (a.right - x),
      minY: s.top - (a.top - y),   maxY: s.bottom - (a.bottom - y),
    };
    e.preventDefault();
  });

  art.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    x = Math.min(bounds.maxX, Math.max(bounds.minX, e.clientX - sx));
    y = Math.min(bounds.maxY, Math.max(bounds.minY, e.clientY - sy));
    tilt += ((Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.6))) - tilt) * 0.3;
    lastX = e.clientX;
    art.style.rotate = `${tilt}deg`;
    apply();
  });

  const end = () => {
    if (!dragging) return;
    dragging = false; tilt = 0;
    art.classList.remove('dragging');
    art.style.rotate = '';           // eases back to level (CSS transition)
  };
  art.addEventListener('pointerup', end);
  art.addEventListener('pointercancel', end);

  window.addEventListener('resize', () => { x = 0; y = 0; apply(); });
});
