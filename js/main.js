// main.js
document.addEventListener('DOMContentLoaded', () => {
    // AOS
    AOS.init({ duration: 800, once: true });
  
    // Emoji randomizer
    const pool = ['👩🏻‍💻','🥂','🎨','🍞','🤓','⛷️','✨','🏝️'];
    document.getElementById('randomize')?.addEventListener('click', e => {
      e.preventDefault();
      const emojis = document.querySelectorAll('.emoji');
      // fade out
      emojis.forEach(el => el.classList.replace('opacity-100', 'opacity-0'));
      setTimeout(() => {
        emojis.forEach(el => {
          el.textContent = pool[Math.floor(Math.random() * pool.length)];
          el.classList.replace('opacity-0', 'opacity-100');
        });
      }, 300);
    });
  });
  