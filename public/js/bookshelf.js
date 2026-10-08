/* Bookshelf: a personal shelf with an AI book concierge, mounted into [data-bookshelf].
   window.BloomBookshelf.ask(query) opens the concierge (the hero's "Ask AI" bar uses it).
   The concierge asks a few questions, then asks POST /api/recommend (Claude) for picks and
   falls back to a built-in matcher over data/books.json when the endpoint isn't available.
   The shelf itself is kept in this browser's localStorage. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORE = 'bloom-bookshelf';
  const PICKS = 4;
  const COVER_W = 200, COVER_H = 300; // the 3D book is built at this size and scaled

  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- Shelf state (this browser only) ---------- */
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && Array.isArray(s.books)) return s;
    } catch (e) { /* storage unavailable or corrupt */ }
    return { books: [], dna: '' };
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  const state = load();
  const onShelf = (id) => state.books.some((b) => b.id === id);

  let catalog = null;
  const byId = {};
  async function loadCatalog() {
    if (catalog) return catalog;
    const res = await fetch('data/books.json');
    catalog = await res.json();
    catalog.forEach((b) => { byId[b.id] = b; });
    // drop anything saved for a book that's no longer in the catalogue
    state.books = state.books.filter((b) => byId[b.id]);
    return catalog;
  }

  /* ---------- Book visuals ---------- */
  function ink(hex) {
    const n = parseInt(hex.slice(1), 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return lum > 0.6 ? '#1f1919' : '#ffffff';
  }
  const vars = (b) => `--c1:${b.colors[0]};--c2:${b.colors[1]};--ink:${ink(b.colors[0])}`;
  function spineSize(b) {
    return { w: clamp(Math.round(b.pages / 11), 26, 58), h: 148 + (hash(b.id) % 5) * 9 };
  }
  const initials = (name) => name.split(/[\s&.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');

  function coverHTML(b) {
    return `<div class="bs-cover" data-p="${hash(b.id) % 5}" style="${vars(b)}">
      <span class="bs-cover-art"></span>
      <span class="bs-cover-title">${esc(b.title)}</span>
      <span class="bs-cover-rule"></span>
      <span class="bs-cover-author">${esc(b.author)}</span>
    </div>`;
  }
  const spineInner = (b, status) => `<span class="bs-spine-band"></span><span class="bs-spine-title">${esc(b.title)}</span><span class="bs-spine-mark">${status === 'done' ? '★' : esc(initials(b.author))}</span>`;

  function book3D(b) {
    const { w, h } = spineSize(b);
    const depth = (w * COVER_H) / h; // so the spine face, scaled to shelf height, is exactly the spine width
    return el(`<div class="bs-fly" aria-hidden="true"><div class="bs-book3d" style="${vars(b)};--D:${depth}px">
      <div class="bs-face bs-front">${coverHTML(b)}</div>
      <div class="bs-face bs-back"></div>
      <div class="bs-face bs-spineface">${spineInner(b)}</div>
      <div class="bs-face bs-pages"></div>
      <div class="bs-face bs-top"></div>
      <div class="bs-face bs-bottom"></div>
    </div></div>`);
  }
  // transform for the flying book: centred on (x, y), scaled, turned
  const T = (x, y, s, ry = 0, rz = 0, rx = 0) => `translate3d(${x - COVER_W / 2}px, ${y - COVER_H / 2}px, 0) scale3d(${s}, ${s}, ${s}) rotateZ(${rz}deg) rotateY(${ry}deg) rotateX(${rx}deg)`;
  const centre = (r) => [r.left + r.width / 2, r.top + r.height / 2];

  /* ---------- Section ---------- */
  let room, shelvesEl, countEl, dnaEl, concierge, chat, reply, flyLayer, detail, toastEl;
  const narrow = () => matchMedia('(max-width: 999px)').matches;

  function build(host) {
    room = host;
    room.classList.add('bs-room');
    room.innerHTML = `
      <div class="bs-panel">
        <header class="bs-head">
          <div class="bs-head-text">
            <p class="bs-kicker">Your library</p>
            <h2 class="bs-title" id="bs-title">My Bookshelf</h2>
            <p class="bs-sub"><span class="bs-count"></span><span class="bs-dna"></span></p>
          </div>
          <div class="bs-head-actions">
            <button type="button" class="bs-btn bs-btn-ai bs-find"><span class="bs-orb" aria-hidden="true"></span>Find a book</button>
          </div>
        </header>
        <div class="bs-case">
          <div class="bs-shelves"></div>
          <div class="bs-empty">
            <div class="bs-motes" aria-hidden="true">${'<span></span>'.repeat(12)}</div>
            <div class="bs-empty-card">
              <div class="bs-flipbook" aria-hidden="true"><span class="bs-fb-left"></span><span class="bs-fb-right"></span><span class="bs-fb-page"></span><span class="bs-fb-page"></span><span class="bs-fb-page"></span></div>
              <h3>Your shelf is empty, for now</h3>
              <p>Answer a few quick questions and our AI concierge will pick books that suit you. Every book you choose lands right here.</p>
              <button type="button" class="bs-btn bs-btn-ai bs-find"><span class="bs-orb" aria-hidden="true"></span>Find my first book</button>
            </div>
          </div>
        </div>
      </div>
      <aside class="bs-concierge" aria-label="Book concierge" aria-hidden="true">
        <header class="bs-c-head">
          <span class="bs-orb bs-orb-lg" aria-hidden="true"></span>
          <div><p class="bs-c-name">Ask AI</p><p class="bs-c-role">Your book concierge</p></div>
          <button type="button" class="bs-icon-btn bs-c-close" aria-label="Close concierge">×</button>
        </header>
        <div class="bs-chat" aria-live="polite"></div>
        <div class="bs-reply"></div>
      </aside>
      <div class="bs-detail" role="dialog" aria-modal="true" aria-labelledby="bs-d-title" hidden>
        <div class="bs-detail-backdrop"></div>
        <div class="bs-detail-stage"><span class="bs-detail-shadow"></span></div>
        <div class="bs-detail-info" tabindex="-1"></div>
      </div>
      <div class="bs-fly-layer"></div>`;
    shelvesEl = room.querySelector('.bs-shelves');
    countEl = room.querySelector('.bs-count');
    dnaEl = room.querySelector('.bs-dna');
    concierge = room.querySelector('.bs-concierge');
    chat = room.querySelector('.bs-chat');
    reply = room.querySelector('.bs-reply');
    flyLayer = room.querySelector('.bs-fly-layer');
    detail = room.querySelector('.bs-detail');
    toastEl = document.createElement('div');
    toastEl.className = 'bs-toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);

    // the dust drifting over an empty shelf
    room.querySelectorAll('.bs-motes span').forEach((m, i) => {
      const r = hash('mote' + i);
      m.style.cssText = `left:${(r % 90) + 5}%;top:${(r >> 4) % 80 + 10}%;--dur:${9 + (r % 7)}s;--delay:-${r % 9}s;--dx:${(r % 40) - 20}px`;
    });

    room.querySelectorAll('.bs-find').forEach((b) => b.addEventListener('click', () => ask()));
    room.querySelector('.bs-c-close').addEventListener('click', closeConcierge);
    room.querySelector('.bs-detail-backdrop').addEventListener('click', closeDetail);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!detail.hidden) closeDetail();
      else if (room.classList.contains('is-asking')) closeConcierge();
    });
    let rt;
    addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { renderShelf(); placeDetailBook(); }, 120);
    });
  }

  async function init() {
    const host = document.querySelector('[data-bookshelf]');
    if (!host) return;
    build(host);
    await loadCatalog().catch(() => { catalog = catalog || []; });
    renderShelf();
    // the shelf builds itself the first time it scrolls into view
    if (!reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        renderShelf(true);
      }, { threshold: 0.25 });
      io.observe(room.querySelector('.bs-case'));
    }
  }

  function lockScroll(on) { document.documentElement.classList.toggle('bs-lock', on); }

  /* ---------- Shelf ---------- */
  function renderShelf(entrance) {
    const n = state.books.length;
    countEl.textContent = n === 0 ? 'No books yet' : `${n} book${n === 1 ? '' : 's'}`;
    dnaEl.textContent = state.dna ? `Your taste: ${state.dna}` : '';
    room.classList.toggle('is-empty', n === 0);

    // Fill rows left to right; the top row keeps room for the plant, every row for a bookend.
    const width = shelvesEl.clientWidth - 24;
    const rows = [[]];
    let used = 0;
    state.books.forEach((entry) => {
      const b = byId[entry.id];
      const w = spineSize(b).w + 3;
      const limit = width - 30 - (rows.length === 1 ? 80 : 0);
      if (used + w > limit && rows[rows.length - 1].length) { rows.push([]); used = 0; }
      rows[rows.length - 1].push(entry);
      used += w;
    });
    while (rows.length < 3) rows.push([]);

    shelvesEl.innerHTML = '';
    let k = 0;
    rows.forEach((row, r) => {
      const rowEl = el(`<div class="bs-row" style="--r:${r}"><div class="bs-books"></div><span class="bs-plank"></span></div>`);
      const books = rowEl.querySelector('.bs-books');
      row.forEach((entry) => {
        const b = byId[entry.id];
        const { w, h } = spineSize(b);
        const spine = el(`<button type="button" class="bs-spine" data-id="${b.id}" data-status="${entry.status || 'want'}" style="${vars(b)};--w:${w}px;--h:${h}px;--k:${k++}" aria-label="${esc(b.title)} by ${esc(b.author)}">${spineInner(b, entry.status)}</button>`);
        spine.addEventListener('click', () => openDetail(b.id));
        books.appendChild(spine);
      });
      if (row.length) books.appendChild(el('<span class="bs-bookend" aria-hidden="true"></span>'));
      if (r === 0) rowEl.appendChild(el(`<span class="bs-plant" aria-hidden="true"><svg viewBox="0 0 64 80"><path d="M32 46C30 30 18 22 8 22c2 12 12 22 24 24z" fill="#5fae6e"/><path d="M32 46c2-18 14-28 26-28-2 14-12 26-26 28z" fill="#4a9a5c"/><path d="M32 48c-1-16 3-30 0-40-6 10-6 26 0 40z" fill="#6cc07a"/><path d="M14 46h36l-4 30H18z" fill="#e07a5f"/><rect x="11" y="44" width="42" height="7" rx="3" fill="#c96a50"/></svg></span>`));
      // ghost outlines where the first books will stand
      if (state.books.length === 0 && r === 1) {
        [34, 46, 30, 52, 38, 28, 44].forEach((w, i) => books.appendChild(el(`<span class="bs-ghost" style="--w:${w}px;--h:${150 + ((i * 37) % 5) * 9}px;--g:${i}" aria-hidden="true"></span>`)));
      }
      shelvesEl.appendChild(rowEl);
    });
    if (entrance && !reduced) {
      room.classList.add('is-entering');
      clearTimeout(renderShelf.t);
      renderShelf.t = setTimeout(() => room.classList.remove('is-entering'), 1600);
    }
  }
  const spineEl = (id) => shelvesEl.querySelector(`.bs-spine[data-id="${id}"]`);

  /* ---------- Add a book: it flies from its card onto the shelf ---------- */
  async function addToShelf(id, reason, coverEl) {
    if (onShelf(id)) return;
    const wasEmpty = state.books.length === 0;
    state.books.push({ id, status: 'want', reason: reason || '', added: Date.now() });
    save();
    const from = coverEl && coverEl.getBoundingClientRect();
    renderShelf();
    const spine = spineEl(id);
    if (!spine) return;
    spine.classList.add('is-pending');

    // on narrow screens the concierge covers the shelf: slide it out of the way
    const peek = narrow();
    if (peek) concierge.classList.add('is-peek');
    // bring the landing spot into view before the book takes off
    const r = spine.getBoundingClientRect();
    const scrolling = r.top < 100 || r.bottom > innerHeight - 20;
    if (scrolling) scrollTo({ top: scrollY + r.top - innerHeight / 2 + r.height / 2, behavior: reduced ? 'auto' : 'smooth' });

    if (!reduced && from) {
      if (peek || scrolling) await sleep(scrolling ? 650 : 380);
      const to = spine.getBoundingClientRect();
      const [x0, y0] = centre(from), [x1, y1] = centre(to);
      const s0 = from.height / COVER_H, s1 = to.height / COVER_H;
      const fly = book3D(byId[id]);
      flyLayer.appendChild(fly);
      const anim = fly.animate([
        { transform: T(x0, y0, s0, 0), offset: 0 },
        { transform: T(x0 + (x1 - x0) * 0.3, Math.min(y0, y1) - 110, s0 * 1.3, -32, -8, 6), offset: 0.38, easing: 'cubic-bezier(.45,0,.25,1)' },
        { transform: T(x1, y1 - 70, s1 * 1.06, 84, 0), offset: 0.82, easing: 'cubic-bezier(.5,0,.5,1)' },
        { transform: T(x1, y1, s1, 90), offset: 1 },
      ], { duration: 1150, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
      await anim.finished;
      fly.remove();
    }
    spine.classList.remove('is-pending');
    spine.classList.add('is-landing');
    spine.closest('.bs-row').classList.add('is-thud');
    burst(spine);
    setTimeout(() => { spine.classList.remove('is-landing'); spine.closest('.bs-row') && spine.closest('.bs-row').classList.remove('is-thud'); }, 900);
    countEl.classList.remove('is-bump'); void countEl.offsetWidth; countEl.classList.add('is-bump');
    toast(wasEmpty ? 'Your first book is on the shelf!' : `“${byId[id].title}” is on your shelf`);
    if (peek) setTimeout(() => concierge.classList.remove('is-peek'), 1100);
  }

  // sparkles where the book lands
  function burst(target) {
    if (reduced) return;
    const r = target.getBoundingClientRect();
    const [cx, cy] = [r.left + r.width / 2, r.top + r.height * 0.35];
    const colors = ['#f97316', '#4c00ff', '#00a1e0', '#ffd166', '#ff5a8a'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = i % 3 ? 'bs-spark' : 'bs-spark bs-spark-star';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = colors[i % colors.length];
      flyLayer.appendChild(p);
      const a = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
      const d = 50 + Math.random() * 70;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 20}px)) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.2}px), calc(-50% + ${Math.sin(a) * d * 1.2 + 30}px)) scale(0.2)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).finished.then(() => p.remove());
    }
    const ring = document.createElement('span');
    ring.className = 'bs-ring';
    ring.style.left = cx + 'px';
    ring.style.top = r.top + r.height / 2 + 'px';
    flyLayer.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ---------- Pick a book off the shelf: it slides out, turns and opens up ---------- */
  let detailId = null, detailFly = null;
  const STATUS = [['want', 'Want to read'], ['reading', 'Reading'], ['done', 'Finished']];

  function detailTarget() {
    const r = room.querySelector('.bs-detail-stage').getBoundingClientRect();
    return [...centre(r), r.height / COVER_H];
  }
  function placeDetailBook() {
    if (!detailFly || detail.hidden) return;
    const [x, y, s] = detailTarget();
    detailFly.style.transform = T(x, y, s, -24, 0, 4);
  }

  async function openDetail(id) {
    if (!detail.hidden) return;
    const b = byId[id];
    const entry = state.books.find((e) => e.id === id);
    const spine = spineEl(id);
    detailId = id;
    const info = room.querySelector('.bs-detail-info');
    info.innerHTML = `
      <p class="bs-d-kicker">${b.kind === 'fiction' ? 'Fiction' : 'Non-fiction'} · ${b.year}</p>
      <h3 class="bs-d-title" id="bs-d-title">${esc(b.title)}</h3>
      <p class="bs-d-author">${esc(b.author)}</p>
      <ul class="bs-d-tags">${[...b.genres.map(genreLabel), `${b.pages} pages`].map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <p class="bs-d-blurb">${esc(b.blurb)}</p>
      ${entry.reason ? `<div class="bs-d-why"><span class="bs-orb" aria-hidden="true"></span><p><strong>Why it's for you</strong>${esc(entry.reason)}</p></div>` : ''}
      <div class="bs-d-status" role="radiogroup" aria-label="Reading status">${STATUS.map(([k, label]) => `<button type="button" role="radio" data-s="${k}" aria-checked="${(entry.status || 'want') === k}">${label}</button>`).join('')}</div>
      <div class="bs-d-actions">
        <button type="button" class="bs-btn bs-btn-ghost bs-d-remove">Remove from shelf</button>
        <button type="button" class="bs-btn bs-btn-dark bs-d-back">Put it back</button>
      </div>`;
    info.querySelectorAll('.bs-d-status button').forEach((btn) => btn.addEventListener('click', () => {
      entry.status = btn.dataset.s;
      save();
      info.querySelectorAll('.bs-d-status button').forEach((x) => x.setAttribute('aria-checked', String(x === btn)));
      spine.dataset.status = entry.status;
      spine.innerHTML = spineInner(b, entry.status);
      if (entry.status === 'done') toast('Another one finished. Nice!');
    }));
    info.querySelector('.bs-d-back').addEventListener('click', closeDetail);
    info.querySelector('.bs-d-remove').addEventListener('click', () => removeBook(id));

    detail.hidden = false;
    lockScroll(true);
    room.classList.add('is-detail');
    requestAnimationFrame(() => detail.classList.add('is-shown'));

    const from = spine.getBoundingClientRect();
    const [x0, y0] = centre(from);
    const s0 = from.height / COVER_H;
    detailFly = book3D(b);
    detailFly.classList.add('is-detail-book');
    flyLayer.appendChild(detailFly);
    spine.classList.add('is-out');
    const [x1, y1, s1] = detailTarget();
    if (!reduced) {
      const anim = detailFly.animate([
        { transform: T(x0, y0, s0, 90) },
        { transform: T(x0, y0 - from.height * 0.55, s0, 90), offset: 0.28, easing: 'cubic-bezier(.5,0,.3,1)' },
        { transform: T((x0 + x1) / 2, Math.min(y0, y1) - 40, (s0 + s1) / 2, 30, 4), offset: 0.62 },
        { transform: T(x1, y1, s1, -24, 0, 4) },
      ], { duration: 1050, easing: 'cubic-bezier(.4,0,.2,1)' });
      await anim.finished;
    }
    if (!detailFly) return;
    detailFly.style.transform = T(x1, y1, s1, -24, 0, 4);
    detailFly.classList.add('is-idle');
    detail.classList.add('is-ready');
    info.focus({ preventScroll: true });
    // the book follows the pointer a little
    detail.onpointermove = (e) => {
      const r = room.querySelector('.bs-detail-stage').getBoundingClientRect();
      const dx = clamp((e.clientX - (r.left + r.width / 2)) / 500, -1, 1), dy = clamp((e.clientY - (r.top + r.height / 2)) / 500, -1, 1);
      detailFly.querySelector('.bs-book3d').style.transform = `rotateY(${dx * 18}deg) rotateX(${-dy * 12}deg)`;
    };
  }

  async function closeDetail(removed) {
    if (detail.hidden || !detailFly) return;
    const fly = detailFly;
    detailFly = null;
    detail.onpointermove = null;
    detail.classList.remove('is-shown', 'is-ready');
    fly.classList.remove('is-idle');
    fly.querySelector('.bs-book3d').style.transform = '';
    const spine = spineEl(detailId);
    if (!reduced) {
      const [x1, y1, s1] = detailTarget();
      if (removed === true || !spine) {
        // removed: the book drifts away and fades
        await fly.animate([
          { transform: T(x1, y1, s1, -24, 0, 4), opacity: 1 },
          { transform: T(x1 + 40, y1 + 140, s1 * 0.6, -60, 18, 20), opacity: 0 },
        ], { duration: 600, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).finished;
      } else {
        const to = spine.getBoundingClientRect();
        const [x0, y0] = centre(to);
        const s0 = to.height / COVER_H;
        await fly.animate([
          { transform: T(x1, y1, s1, -24, 0, 4) },
          { transform: T(x0, y0 - to.height * 0.55, s0, 90), offset: 0.7, easing: 'cubic-bezier(.4,0,.2,1)' },
          { transform: T(x0, y0, s0, 90) },
        ], { duration: 850, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished;
      }
    }
    fly.remove();
    if (spine) {
      spine.classList.remove('is-out');
      spine.classList.add('is-landing');
      setTimeout(() => spine.classList.remove('is-landing'), 700);
      spine.focus({ preventScroll: true });
    }
    detail.hidden = true;
    room.classList.remove('is-detail');
    if (!(narrow() && room.classList.contains('is-asking'))) lockScroll(false);
  }

  async function removeBook(id) {
    state.books = state.books.filter((b) => b.id !== id);
    save();
    await closeDetail(true);
    renderShelf();
    room.querySelectorAll(`.bs-pick[data-id="${id}"]`).forEach(markPickable);
    toast(`Removed “${byId[id].title}”`);
  }

  /* ---------- Concierge ---------- */
  const GENRES = {
    mystery: 'Mystery & thrillers', scifi: 'Science fiction', fantasy: 'Fantasy', literary: 'Literary fiction', romance: 'Romance',
    children: 'Picture books', science: 'Science', history: 'History', psychology: 'Psychology & mind', biography: 'Biography & memoir', business: 'Business & money', selfgrowth: 'Self-growth',
  };
  const genreLabel = (g) => GENRES[g] || g;
  const GOALS = [
    ['escape', 'Pull me into another world', '🌌', 'A world-hopper. Love it.'],
    ['learn', 'Teach me something fascinating', '🔭', 'A curious mind, my favourite kind.'],
    ['grow', 'Help me grow at work & in life', '🌱', 'Investing in yourself. Smart move.'],
    ['surprise', 'Surprise me', '🎲', 'An adventurer! I’ll keep it interesting.'],
  ];
  const GENRES_FOR = {
    escape: ['mystery', 'scifi', 'fantasy', 'literary', 'romance', 'children'],
    learn: ['science', 'history', 'psychology', 'biography'],
    grow: ['selfgrowth', 'business', 'psychology', 'biography'],
    surprise: ['scifi', 'mystery', 'literary', 'history', 'psychology', 'selfgrowth'],
  };
  const FICTION = ['mystery', 'scifi', 'fantasy', 'literary', 'romance', 'children'];
  const VIBES = [
    ['cozy', 'Cozy & warm', '☕', 'Blanket-and-tea energy. Got it.'],
    ['mindbending', 'Mind-bending', '🌀', 'Brace your brain. Got it.'],
    ['heartfelt', 'Heart-tugging', '💛', 'Tissues on standby.'],
    ['thrilling', 'Edge-of-my-seat', '⚡', 'Late nights ahead, then.'],
    ['inspiring', 'Inspiring', '✨', 'Let’s light a spark.'],
    ['funny', 'Make me laugh', '😄', 'Laughter it is.'],
  ];
  const LENGTHS = [
    ['quick', 'A quick read', 'an evening or two', 'Short and sweet, noted.'],
    ['medium', 'A few weeks', 'a steady companion', 'A comfortable pace, noted.'],
    ['epic', 'Something epic', 'I want to get lost', 'Going big. I like it.'],
    ['any', 'Any length', 'it doesn’t matter', 'No limits, noted.'],
  ];
  const GENRE_NOUN = {
    mystery: 'mystery', scifi: 'sci-fi story', fantasy: 'fantasy', literary: 'novel', romance: 'romance', children: 'picture book',
    science: 'science read', history: 'history', psychology: 'psychology read', biography: 'memoir', business: 'business read', selfgrowth: 'self-growth read',
  };
  const VIBE_PHRASE = { cozy: 'cozy and warm', mindbending: 'properly mind-bending', heartfelt: 'quietly heart-tugging', thrilling: 'hard to put down', inspiring: 'genuinely inspiring', funny: 'laugh-out-loud funny' };

  let answers = null, shown = [], session = 0;

  function firstName() {
    const n = document.querySelector('[data-node-id="306:2288"]');
    const name = n && n.textContent.trim().split(/\s+/)[0];
    return name || 'there';
  }

  function bubble(who, html) {
    const b = el(`<div class="bs-msg bs-msg-${who}"><div class="bs-bubble">${html}</div></div>`);
    chat.appendChild(b);
    chat.scrollTo({ top: chat.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    return b;
  }
  async function say(html, typing = 650) {
    const id = session;
    const t = bubble('ai', '<span class="bs-typing"><i></i><i></i><i></i></span>');
    t.classList.add('is-typing');
    await sleep(typing);
    if (id !== session) { t.remove(); throw new Error('stale'); }
    t.classList.remove('is-typing');
    t.querySelector('.bs-bubble').innerHTML = html;
    chat.scrollTo({ top: chat.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    return t;
  }
  const userSays = (text) => bubble('me', esc(text));

  // single or multi choice chips in the reply tray
  function choose(options, { multi = false } = {}) {
    return new Promise((resolve) => {
      reply.innerHTML = '';
      const wrap = el(`<div class="bs-chips${multi ? ' is-multi' : ''}" role="${multi ? 'group' : 'radiogroup'}"></div>`);
      const picked = new Set();
      options.forEach(([key, label, icon, hint], i) => {
        const chip = el(`<button type="button" class="bs-chip" style="--i:${i}" ${multi ? 'aria-pressed="false"' : ''}>${icon ? `<span class="bs-chip-icon">${icon}</span>` : ''}<span>${esc(label)}${hint && !icon ? `<small>${esc(hint)}</small>` : ''}</span></button>`);
        chip.addEventListener('click', () => {
          if (!multi) { reply.innerHTML = ''; return resolve(key); }
          picked.has(key) ? picked.delete(key) : picked.add(key);
          chip.setAttribute('aria-pressed', String(picked.has(key)));
          go.disabled = picked.size === 0;
          go.textContent = picked.size ? `Continue with ${picked.size}` : 'Pick one or more';
        });
        wrap.appendChild(chip);
      });
      reply.appendChild(wrap);
      let go;
      if (multi) {
        const row = el('<div class="bs-reply-row"><button type="button" class="bs-btn bs-btn-ghost bs-any">Anything goes</button><button type="button" class="bs-btn bs-btn-dark bs-go" disabled>Pick one or more</button></div>');
        go = row.querySelector('.bs-go');
        go.addEventListener('click', () => { reply.innerHTML = ''; resolve([...picked]); });
        row.querySelector('.bs-any').addEventListener('click', () => { reply.innerHTML = ''; resolve([]); });
        reply.appendChild(row);
      }
      const first = reply.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    });
  }
  function ask(placeholder) {
    return new Promise((resolve) => {
      reply.innerHTML = '';
      const form = el(`<form class="bs-ask"><input type="text" maxlength="160" placeholder="${esc(placeholder)}" aria-label="A book or topic you loved"><div class="bs-reply-row"><button type="button" class="bs-btn bs-btn-ghost bs-skip-q">Skip</button><button type="submit" class="bs-btn bs-btn-ai"><span class="bs-orb" aria-hidden="true"></span>Find my books</button></div></form>`);
      const input = form.querySelector('input');
      form.addEventListener('submit', (e) => { e.preventDefault(); reply.innerHTML = ''; resolve(input.value.trim()); });
      form.querySelector('.bs-skip-q').addEventListener('click', () => { reply.innerHTML = ''; resolve(''); });
      reply.appendChild(form);
      input.focus({ preventScroll: true });
    });
  }

  async function ask(query) {
    if (!room) return;
    if (!catalog || !catalog.length) await loadCatalog().catch(() => {});
    query = (query || '').trim().slice(0, 160);
    room.classList.add('is-asking');
    concierge.setAttribute('aria-hidden', 'false');
    concierge.classList.remove('is-peek');
    if (narrow()) lockScroll(true);
    else {
      // let the shelf show beside the concierge so picks can be seen landing
      const top = room.getBoundingClientRect().top + scrollY - 70;
      if (Math.abs(scrollY - top) > 40) scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
    setTimeout(renderShelf, reduced ? 0 : 520); // the shelf narrows to make room
    session++;
    chat.innerHTML = '';
    reply.innerHTML = '';
    answers = { request: query, goal: '', genres: [], vibe: '', length: '', loved: '' };
    shown = [];
    try {
      if (query) {
        userSays(query);
        const guess = requestGenres(query);
        answers.genres = guess;
        answers.goal = guess.some((g) => FICTION.includes(g)) ? 'escape' : guess.length ? 'learn' : 'surprise';
        await say(`Hi ${esc(firstName())}! “${esc(query)}”, great place to start.`, 600);
        await say('Two quick questions so I get it just right.', 600);
        await askVibeAndLength();
        await recommendAndShow();
        return;
      }
      await say(`Hi ${esc(firstName())}! 👋 I’m your AI book concierge.`, 500);
      await say('Five quick questions and I’ll find books you’ll actually want to finish.', 700);

      await say('First up: what should your next book do for you?');
      answers.goal = await choose(GOALS);
      const goal = GOALS.find((g) => g[0] === answers.goal);
      userSays(`${goal[2]} ${goal[1]}`);
      await say(goal[3], 500);

      await say(answers.goal === 'escape' ? 'Which worlds pull you in? Pick as many as you like.' : 'Which topics get you curious? Pick as many as you like.');
      answers.genres = await choose(GENRES_FOR[answers.goal].map((g) => [g, genreLabel(g)]), { multi: true });
      userSays(answers.genres.length ? answers.genres.map(genreLabel).join(', ') : 'Anything goes');
      await say(answers.genres.length > 2 ? 'Wide-ranging taste. Noted.' : answers.genres.length ? 'Great picks. Noted.' : 'Open to anything. Noted.', 500);

      await askVibeAndLength();

      await say('Last one, and optional: a book or topic you loved lately?');
      answers.loved = await ask('e.g. The Martian, or “space and survival”');
      userSays(answers.loved || 'Skip');
      await recommendAndShow();
    } catch (e) {
      if (e.message !== 'stale') throw e;
    }
  }

  async function askVibeAndLength() {
    await say('What kind of feeling are you after?');
    answers.vibe = await choose(VIBES);
    const vibe = VIBES.find((v) => v[0] === answers.vibe);
    userSays(`${vibe[2]} ${vibe[1]}`);
    await say(vibe[3], 500);

    await say('How much reading time do you have?');
    answers.length = await choose(LENGTHS);
    const len = LENGTHS.find((l) => l[0] === answers.length);
    userSays(`${len[1]} (${len[2]})`);
    await say(len[3], 450);
  }

  function closeConcierge() {
    session++;
    room.classList.remove('is-asking');
    concierge.setAttribute('aria-hidden', 'true');
    if (detail.hidden) lockScroll(false);
    concierge.classList.remove('is-peek');
    setTimeout(renderShelf, reduced ? 0 : 520);
    const find = room.querySelector('.bs-head .bs-find');
    if (find) find.focus({ preventScroll: true });
  }

  async function thinking() {
    const id = session;
    const b = bubble('ai', `<div class="bs-thinking"><span class="bs-mini-book" aria-hidden="true"><i></i><i></i><i></i></span><span class="bs-think-text">Reading your taste…</span></div>`);
    const lines = [`Browsing ${catalog.length} books…`, 'Matching your vibe…', 'Checking what’s on your shelf…', 'Picking favourites…'];
    let i = 0;
    const timer = setInterval(() => {
      if (id !== session) return clearInterval(timer);
      const t = b.querySelector('.bs-think-text');
      t.classList.remove('is-swap'); void t.offsetWidth; t.classList.add('is-swap');
      t.textContent = lines[i++ % lines.length];
    }, 1100);
    return () => { clearInterval(timer); b.remove(); };
  }

  async function recommendAndShow(more) {
    const id = session;
    const stop = await thinking();
    const exclude = [...state.books.map((b) => b.id), ...shown];
    const [result] = await Promise.all([fetchPicks(exclude), sleep(1800)]);
    stop();
    if (id !== session) throw new Error('stale');
    if (!result.picks.length) {
      await say('That’s every book I have for you right now. Check back soon, the library keeps growing!');
      return endOptions();
    }
    if (!more) {
      state.dna = result.summary;
      save();
      dnaEl.textContent = `Your taste: ${state.dna}`;
      await say(`Here’s what I picked for you.${result.summary ? `<span class="bs-dna-chip">Your taste: ${esc(result.summary)}</span>` : ''}`, 300);
    } else {
      await say('A few more, fresh off the cart:', 300);
    }
    const list = el('<div class="bs-picks"></div>');
    result.picks.forEach((p, i) => {
      shown.push(p.id);
      list.appendChild(pickCard(byId[p.id], p.reason, i));
    });
    chat.appendChild(list);
    chat.scrollTo({ top: chat.scrollHeight - list.offsetHeight - 160, behavior: reduced ? 'auto' : 'smooth' });
    endOptions();
  }

  function endOptions() {
    reply.innerHTML = '';
    const row = el('<div class="bs-reply-row"><button type="button" class="bs-btn bs-btn-ghost bs-restart">Start over</button><button type="button" class="bs-btn bs-btn-dark bs-more">Show me more</button></div>');
    row.querySelector('.bs-restart').addEventListener('click', () => ask());
    row.querySelector('.bs-more').addEventListener('click', async () => {
      reply.innerHTML = '';
      userSays('Show me more');
      try { await recommendAndShow(true); } catch (e) { if (e.message !== 'stale') throw e; }
    });
    reply.appendChild(row);
  }

  function pickCard(b, reason, i) {
    const card = el(`<article class="bs-pick" data-id="${b.id}" style="--i:${i}">
      <div class="bs-pick-cover">${coverHTML(b)}</div>
      <div class="bs-pick-body">
        <h4>${esc(b.title)}</h4>
        <p class="bs-pick-meta">${esc(b.author)} · ${b.pages} pages</p>
        <p class="bs-pick-why">${esc(reason)}</p>
        <div class="bs-pick-actions">
          <button type="button" class="bs-btn bs-btn-dark bs-add">Add to shelf</button>
          <button type="button" class="bs-btn bs-btn-ghost bs-nope">Not for me</button>
        </div>
      </div>
    </article>`);
    const add = card.querySelector('.bs-add');
    add.addEventListener('click', () => {
      if (onShelf(b.id)) return;
      markAdded(card);
      addToShelf(b.id, reason, card.querySelector('.bs-cover'));
    });
    card.querySelector('.bs-nope').addEventListener('click', () => {
      card.classList.add('is-leaving');
      setTimeout(() => card.remove(), reduced ? 0 : 420);
    });
    // a little 3D tilt on the cover
    const cover = card.querySelector('.bs-pick-cover');
    cover.addEventListener('pointermove', (e) => {
      const r = cover.getBoundingClientRect();
      cover.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 24}deg`);
      cover.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 18}deg`);
    });
    cover.addEventListener('pointerleave', () => { cover.style.removeProperty('--ry'); cover.style.removeProperty('--rx'); });
    if (onShelf(b.id)) markAdded(card);
    return card;
  }
  function markAdded(card) {
    const add = card.querySelector('.bs-add');
    card.classList.add('is-added');
    add.textContent = 'On your shelf ✓';
    add.disabled = true;
  }
  function markPickable(card) {
    const add = card.querySelector('.bs-add');
    card.classList.remove('is-added');
    add.textContent = 'Add to shelf';
    add.disabled = false;
  }

  /* ---------- Recommendations: Claude first, the built-in matcher as a fallback ---------- */
  async function fetchPicks(exclude) {
    const label = (list, key) => (list.find((x) => x[0] === key) || [])[1] || '';
    const payload = {
      goal: label(GOALS, answers.goal),
      genres: answers.genres.map(genreLabel),
      vibe: label(VIBES, answers.vibe),
      length: answers.length === 'any' ? '' : `${label(LENGTHS, answers.length)} (${LENGTHS.find((l) => l[0] === answers.length)[2]})`,
      loved: answers.loved,
      request: answers.request,
      shelf: exclude,
    };
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);
      const res = await fetch('api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const picks = (data.picks || []).filter((p) => byId[p.id] && !exclude.includes(p.id));
        if (picks.length) return { summary: data.summary || localSummary(), picks };
      }
    } catch (e) { /* offline, static hosting or timed out: use the matcher */ }
    return localPicks(exclude);
  }

  const KEYWORDS = [
    [/picture book|kids?\b|child|bedtime|toddler|little ones/i, 'children'],
    [/space|mars|alien|robot|\bai\b|future|planet|time travel/i, 'scifi'],
    [/magic|dragon|myth|wizard|fairy/i, 'fantasy'],
    [/murder|detective|crime|thriller|mystery|whodunit/i, 'mystery'],
    [/love|romance|relationship/i, 'romance'],
    [/habit|productiv|focus|career|motivat|discipline/i, 'selfgrowth'],
    [/money|startup|business|leader|invest|entrepreneur/i, 'business'],
    [/brain|mind|psycholog|behaviou?r|decision/i, 'psychology'],
    [/history|war|ancient|empire|civili[sz]ation/i, 'history'],
    [/science|biology|physics|universe|nature|gene/i, 'science'],
    [/memoir|life story|biograph/i, 'biography'],
  ];

  const requestGenres = (text) => KEYWORDS.filter(([re]) => re.test(text)).map(([, g]) => g);

  function localSummary() {
    const vibe = (VIBES.find((v) => v[0] === answers.vibe) || [])[1] || '';
    const g = answers.genres.slice(0, 2).map((x) => genreLabel(x).replace(/ & .*/, '').toLowerCase()).join(' & ');
    const len = { quick: 'quick reads', medium: 'for a few weeks', epic: 'epic reads', any: '' }[answers.length];
    return [vibe, g || (answers.goal === 'escape' ? 'fiction' : answers.goal === 'surprise' ? 'surprises' : 'non-fiction'), len].filter(Boolean).join(' · ');
  }

  function localPicks(exclude) {
    const loved = (answers.loved || '').toLowerCase();
    const lovedBook = loved && catalog.find((b) => loved.includes(b.title.toLowerCase()) || (loved.length > 4 && b.title.toLowerCase().includes(loved)));
    const lovedGenres = new Set(lovedBook ? lovedBook.genres : requestGenres(loved));
    const asked = (answers.request || '').toLowerCase();
    const scored = catalog.filter((b) => !exclude.includes(b.id) && (!lovedBook || b.id !== lovedBook.id)).map((b) => {
      let s = Math.random() * 0.8;
      const why = {};
      if (answers.goal === 'escape') s += b.kind === 'fiction' ? 3 : -4;
      if (answers.goal === 'learn') s += b.kind === 'nonfiction' && b.genres.some((g) => ['science', 'history', 'psychology', 'biography'].includes(g)) ? 3 : -2;
      if (answers.goal === 'grow') s += b.genres.some((g) => ['selfgrowth', 'business', 'biography', 'psychology'].includes(g)) ? 3 : -2;
      const g = b.genres.find((x) => answers.genres.includes(x));
      if (g) { s += 4; why.genre = g; }
      if (b.vibes.includes(answers.vibe)) { s += 3; why.vibe = true; }
      const L = answers.length;
      if ((L === 'quick' && b.pages <= 260) || (L === 'medium' && b.pages > 250 && b.pages <= 450) || (L === 'epic' && b.pages >= 440)) { s += 2; why.length = true; }
      else if (L === 'quick' && b.pages > 380) s -= 2;
      if (asked && (asked.includes(b.title.toLowerCase()) || asked.includes(b.author.toLowerCase().split(' ').pop()))) s += 3;
      if (asked && /brave|courage/.test(asked) && b.vibes.includes('inspiring')) s += 1;
      if (answers.goal !== 'escape' && answers.genres.includes('children') !== b.genres.includes('children')) s -= 3;
      const lg = b.genres.find((x) => lovedGenres.has(x));
      if (lg) { s += 2; why.loved = true; }
      if (lovedBook && lovedBook.author === b.author) { s += 3; why.loved = true; }
      if (lovedBook && b.vibes.some((v) => lovedBook.vibes.includes(v))) s += 1;
      return { b, s, why };
    }).sort((a, z) => z.s - a.s).slice(0, PICKS);
    return { summary: localSummary(), picks: scored.map(({ b, why }) => ({ id: b.id, reason: localReason(b, why, lovedBook) })) };
  }

  function localReason(b, why, lovedBook) {
    const kind = why.genre ? GENRE_NOUN[why.genre] : b.kind === 'fiction' ? 'story' : 'read';
    let s = why.vibe ? `You asked for something ${VIBE_PHRASE[answers.vibe]}, and this ${kind} delivers` : `A standout ${kind} that’s ${VIBE_PHRASE[b.vibes[0]]}`;
    if (why.length) s += answers.length === 'quick' ? `, in just ${b.pages} pages` : answers.length === 'epic' ? `, with ${b.pages} pages to get lost in` : `, at a steady ${b.pages} pages`;
    s += '.';
    if (why.loved && lovedBook) s += ` If you loved ${lovedBook.title}, this shares its spark.`;
    else if (why.loved && answers.loved) s += ' It’s right in line with what you’ve enjoyed lately.';
    return s;
  }

  window.BloomBookshelf = { ask };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', init);
  else init();
})();
