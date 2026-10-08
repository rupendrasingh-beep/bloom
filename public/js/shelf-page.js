/* Bookshelf page: header and first-fold interactions. The shelf itself is js/bookshelf.js. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- Header ---------- */
  const header = document.querySelector('.sp-header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const theme = document.querySelector('.sp-theme');
  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    theme.setAttribute('aria-pressed', String(dark));
    theme.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    try { localStorage.setItem('bloom-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
  };
  applyTheme(root.classList.contains('dark'));
  theme.addEventListener('click', () => {
    theme.classList.remove('is-swapping'); void theme.offsetWidth; theme.classList.add('is-swapping');
    applyTheme(!root.classList.contains('dark'));
  });

  /* ---------- Ask AI ---------- */
  const form = document.querySelector('.sp-ask');
  const field = form.querySelector('.sp-field');
  const input = form.querySelector('input');
  const placeholder = form.querySelector('.sp-placeholder');

  document.querySelector('.sp-search-btn').addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    input.focus({ preventScroll: true });
  });

  input.addEventListener('input', () => field.classList.toggle('has-text', input.value.length > 0));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.BloomBookshelf.ask(input.value);
    input.blur();
  });

  // The placeholder types out a few example requests in turn.
  const examples = [
    'Try: a picture book about being brave',
    'Try: a gripping mystery for a long flight',
    'Try: something like The Martian',
    'Try: a short book on building better habits',
    'Try: a cozy fantasy to unwind with',
  ];
  if (!reduced) {
    let i = 0;
    const type = async () => {
      await new Promise((r) => setTimeout(r, 3200));
      for (;;) {
        if (document.hidden || field.classList.contains('has-text') || document.activeElement === input) {
          await new Promise((r) => setTimeout(r, 1200));
          continue;
        }
        const from = examples[i], to = examples[(i = (i + 1) % examples.length)];
        for (let n = from.length; n >= 5; n--) { placeholder.textContent = from.slice(0, n); await new Promise((r) => setTimeout(r, 18)); }
        for (let n = 5; n <= to.length; n++) { placeholder.textContent = to.slice(0, n); await new Promise((r) => setTimeout(r, 38)); }
        await new Promise((r) => setTimeout(r, 2800));
      }
    };
    type();
  }

  /* ---------- The glow behind the search bar ---------- */
  const halo = form.querySelector('canvas.mesh');
  if (halo && window.renderMeshes) {
    window.renderMeshes();
    if (window.meshAmbient) window.meshAmbient(halo, form, { idle: 0.7, speed: 0.4, tess: 48, amp: 8, reach: 12 });
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(window.renderMeshes, 200); });
  }

  /* ---------- Covers lean away from the pointer ---------- */
  const fan = document.querySelector('.sp-fan');
  if (fan && !reduced && matchMedia('(hover: hover)').matches) {
    const fold = document.querySelector('.sp-fold');
    fold.addEventListener('pointermove', (e) => {
      const r = fold.getBoundingClientRect();
      fan.style.translate = `calc(-50% + 23.5px + ${((e.clientX - r.left) / r.width - 0.5) * -14}px) 0`;
    });
    fold.addEventListener('pointerleave', () => { fan.style.translate = ''; });
  }
})();
