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

  const btn = document.getElementById('copy-email');
  btn?.addEventListener('click', async () => {
    const text = address();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    btn.textContent = 'copied ✓';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('done'); }, 1800);
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

// ApplyGen lightbox — the tile shows the main screen; clicking opens the rest.
document.addEventListener('DOMContentLoaded', () => {
  const dlg = document.getElementById('shots');
  const open = document.getElementById('open-shots');
  if (!dlg || !open || typeof dlg.showModal !== 'function') return;

  const shots = [...document.querySelectorAll('#shot-list li')].map((li) => ({
    src: li.dataset.src, alt: li.dataset.alt, cap: li.dataset.cap,
  }));
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-cap');
  const count = document.getElementById('lb-count');
  let i = 0;

  const lb = dlg.querySelector('.lb');
  // keep the controls exactly as wide as the picture
  const fit = () => { if (img.clientWidth) lb.style.width = img.clientWidth + 'px'; };
  img.addEventListener('load', fit);
  window.addEventListener('resize', fit);

  const show = (n) => {
    i = (n + shots.length) % shots.length;
    img.src = shots[i].src; img.alt = shots[i].alt;
    cap.textContent = shots[i].cap;
    count.textContent = `${i + 1} / ${shots.length}`;
  };

  open.addEventListener('click', () => { show(0); dlg.showModal(); });
  document.getElementById('lb-close').addEventListener('click', () => dlg.close());
  document.getElementById('lb-prev').addEventListener('click', () => show(i - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(i + 1));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });   // click the backdrop to close
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
});
