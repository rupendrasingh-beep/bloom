// Penguin Random House India landing page — theme toggle, ask box and mood chips.

(() => {
  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const toggleIcon = toggle.querySelector('img');

  function renderTheme() {
    const dark = root.dataset.theme === 'dark';
    toggleIcon.src = dark ? 'assets/ui-sun.svg' : 'assets/books/moon.svg';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    toggle.setAttribute('aria-pressed', String(dark));
  }

  toggle.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('books-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
    renderTheme();
  });
  renderTheme();

  /* ---------- Ask box ---------- */
  const form = document.querySelector('.ask');
  const input = form.querySelector('input');
  const field = form.querySelector('.ask__field');
  const moods = [...document.querySelectorAll('.mood')];

  const SURPRISES = [
    'A short novel I can finish in a weekend',
    'Indian history told like a thriller',
    'A funny book for a long train ride',
    'Poetry for someone who thinks they hate poetry',
    'A graphic novel for a curious 10-year-old',
  ];

  function syncValue() {
    field.classList.toggle('has-value', input.value.trim() !== '');
  }

  function setQuery(text, chip) {
    input.value = text;
    syncValue();
    moods.forEach((m) => m.setAttribute('aria-pressed', String(m === chip)));
    input.focus();
    input.setSelectionRange(text.length, text.length);
  }

  input.addEventListener('input', () => {
    syncValue();
    moods.forEach((m) => m.setAttribute('aria-pressed', 'false'));
  });

  moods.forEach((chip) => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      const text = chip.hasAttribute('data-surprise')
        ? SURPRISES[Math.floor(Math.random() * SURPRISES.length)]
        : chip.dataset.prompt;
      setQuery(text, chip);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      form.classList.remove('is-empty'); void form.offsetWidth; form.classList.add('is-empty');
      input.focus();
      return;
    }
    // No search backend yet: keep the query in the URL and announce it for whatever handles it later.
    const url = new URL(location.href);
    url.searchParams.set('q', q);
    history.replaceState(null, '', url);
    document.dispatchEvent(new CustomEvent('books:ask', { detail: { query: q } }));
  });
  form.addEventListener('animationend', () => form.classList.remove('is-empty'));

  // Restore a query passed in the URL, e.g. books.html?q=poetry
  const initial = new URLSearchParams(location.search).get('q');
  if (initial) { input.value = initial; syncValue(); }
})();
