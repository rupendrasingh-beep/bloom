// Penguin Random House India landing page — header menu, theme toggle and the Ask AI box.
(() => {
  const root = document.documentElement;

  // ---------- Theme toggle (moon / sun) ----------
  const themeBtn = document.querySelector('.theme-toggle');
  const themeIcon = themeBtn.querySelector('img');

  function applyTheme(dark) {
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Light mode' : 'Dark mode');
    themeIcon.src = dark ? 'assets/ui-sun.svg' : 'assets/imgMoon.svg';
  }

  applyTheme(root.dataset.theme === 'dark');
  themeBtn.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    applyTheme(dark);
    try { localStorage.setItem('prh-theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.site-header')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });

  // ---------- Ask AI ----------
  const form = document.querySelector('.ask');
  const input = document.getElementById('ask-input');

  const SURPRISES = [
    'A short novel I can finish this weekend',
    'A funny memoir for a long flight',
    'An epic fantasy with a great map',
    'A classic Indian novel everyone should read',
    'A mystery set in a small town',
  ];

  function fill(text) {
    input.value = text;
    input.focus();
    input.setSelectionRange(text.length, text.length);
  }

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.hasAttribute('data-surprise')) {
        fill(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]);
      } else {
        fill(chip.dataset.query);
      }
    });
  });

  // There is no search backend yet: an empty submit fills in the example,
  // a filled one is handed to whatever handler gets wired in here.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { fill(input.placeholder.replace(/^Try:\s*/, '')); return; }
    form.dispatchEvent(new CustomEvent('ask', { detail: { query: q } }));
  });
})();
