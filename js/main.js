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
// the page. Once moved it is pinned to its spot on the page itself, so layout
// changes elsewhere (like expanding "projects") don't push it around.
// It tilts with how fast you fling it, and the page scrolls along when you drag
// near the top or bottom edge of the window.
document.addEventListener('DOMContentLoaded', () => {
  const art = document.getElementById('drag-art');
  if (!art) return;

  // desktop only: needs a wide screen and a real pointer (no touch dragging)
  const desktop = window.matchMedia('(min-width: 761px) and (pointer: fine)');

  let left = 0, top = 0;                  // position in page coordinates (once detached)
  let cx = 0, cy = 0, gx = 0, gy = 0;     // pointer (viewport) + grab offset
  let lastX = 0, tilt = 0, dragging = false, detached = false, raf = 0;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const page = () => ({ w: document.documentElement.clientWidth, h: document.documentElement.scrollHeight });

  // take the art out of the layout and pin it to the page; leave an empty slot so the section keeps its shape
  const detach = () => {
    if (detached) return;
    const r = art.getBoundingClientRect();
    const slot = document.createElement('div');
    slot.className = 'contact__art-slot';
    art.parentNode.insertBefore(slot, art);
    left = r.left + scrollX; top = r.top + scrollY;
    Object.assign(art.style, { position: 'absolute', left: left + 'px', top: top + 'px',
      width: r.width + 'px', height: r.height + 'px', maxWidth: 'none', minHeight: '0', margin: '0' });
    document.body.appendChild(art);
    detached = true;
  };

  const place = () => {
    const p = page(), w = art.offsetWidth, h = art.offsetHeight;
    left = clamp(cx + scrollX - gx, 0, Math.max(0, p.w - w));
    top = clamp(cy + scrollY - gy, 0, Math.max(0, p.h - h));
    art.style.left = left + 'px'; art.style.top = top + 'px';
  };

  const loop = () => {
    if (!dragging) return;
    const edge = 70, speed = 14;
    if (cy < edge) scrollBy({ top: -speed, behavior: 'instant' });
    else if (cy > innerHeight - edge) scrollBy({ top: speed, behavior: 'instant' });
    place();
    raf = requestAnimationFrame(loop);
  };

  art.addEventListener('pointerdown', (e) => {
    if (!desktop.matches) return;          // phones/tablets: leave the image alone
    detach();
    dragging = true;
    art.setPointerCapture(e.pointerId);
    art.classList.add('dragging');
    cx = e.clientX; cy = e.clientY; lastX = cx;
    gx = cx + scrollX - left; gy = cy + scrollY - top;
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

  // if the window becomes phone-sized after a drag, put the image back in its place
  const reattach = () => {
    if (desktop.matches || !detached) return;
    const slot = document.querySelector('.contact__art-slot');
    ['position', 'left', 'top', 'width', 'height', 'maxWidth', 'minHeight', 'margin', 'rotate'].forEach((p) => { art.style[p] = ''; });
    if (slot) { slot.parentNode.insertBefore(art, slot); slot.remove(); }
    detached = false;
  };
  desktop.addEventListener?.('change', reattach);

  // keep it on the page if the page gets smaller (e.g. projects collapse, window resize)
  const keepOnPage = () => {
    if (!detached) return;
    const p = page();
    left = clamp(left, 0, Math.max(0, p.w - art.offsetWidth));
    top = clamp(top, 0, Math.max(0, p.h - art.offsetHeight));
    art.style.left = left + 'px'; art.style.top = top + 'px';
  };
  window.addEventListener('resize', keepOnPage);
  if ('ResizeObserver' in window) new ResizeObserver(keepOnPage).observe(document.body);
});
