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
