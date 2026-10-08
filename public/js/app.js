/* Dashboard micro-interactions. Elements are addressed by their Figma node ids. */
(function () {
  const $ = (id) => document.querySelector(`[data-node-id="${id}"]`);
  const $$ = (ids) => ids.map($).filter(Boolean);
  const add = (els, ...cls) => [].concat(els).filter(Boolean).forEach((el) => el.classList.add(...cls));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fit the 1728px artboard to the viewport ---------- */
  const stage = document.getElementById('stage');
  function fit() {
    const z = Math.min(1, document.documentElement.clientWidth / 1728);
    stage.style.zoom = z;
  }
  fit();
  addEventListener('resize', fit);

  /* ---------- Mesh gradients ---------- */
  window.renderMeshes();
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(window.renderMeshes, 200); });

  /* ---------- Entrance timeline (delays from Figma: start% x 2s) ---------- */
  const titles = { '306:2106': 0, '306:2146': 0.08, '306:2677': 0.24, '306:2521': 0.16, '306:2684': 0.32, '306:3012': 0.4, '325:3248': 0.48 };
  Object.entries(titles).forEach(([id, d]) => { const el = $(id); if (el) { el.style.setProperty('--d', d + 's'); el.classList.add('mi-title'); } });
  add($('306:2516'), 'mi-tagline');

  const panels = ['306:2290', '306:2142', '306:2517', '306:2706', '306:2680', '306:2828', '325:3245', '306:2582'];
  panels.forEach((id, i) => { const el = $(id); if (el) { el.style.setProperty('--d', 0.05 + i * 0.07 + 's'); el.classList.add('mi-reveal'); } });

  /* ---------- "Where Human & AI works together": the human <-> AI link ---------- */
  // The words come into focus one at a time (blur to sharp), then an arc links "Human" and
  // "AI" with signal pulses travelling slowly both ways, and the two words glow in turn as
  // if in conversation. Hover quickens the exchange a little.
  function aiLink(el, startDelay) {
    const p = el && el.querySelector('p');
    if (!p) return;
    const text = p.textContent.trim();
    p.setAttribute('aria-label', text);
    p.textContent = '';
    const words = text.split(' ').map((word, i, all) => {
      const w = document.createElement('span');
      w.className = 'lk-w' + (word === 'Human' ? ' lk-human' : word === 'AI' ? ' lk-ai' : '');
      w.textContent = word;
      w.setAttribute('aria-hidden', 'true');
      w.style.setProperty('--i', i);
      p.appendChild(w);
      if (i < all.length - 1) p.appendChild(document.createTextNode(' '));
      return w;
    });
    el.classList.add('lk');
    // each word paints its own slice of the line's gradient, so it can blur and glow on its own
    const align = () => {
      const width = p.offsetWidth;
      words.forEach((w) => { w.style.backgroundSize = `${width}px 100%`; w.style.backgroundPosition = `${-w.offsetLeft}px 0`; });
    };
    align();
    document.fonts && document.fonts.ready.then(align);

    const canvas = document.createElement('canvas');
    canvas.className = 'lk-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    el.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const human = el.querySelector('.lk-human'), ai = el.querySelector('.lk-ai');
    const PAD = 28;
    let W = 0, H = 0, from = null, to = null;
    const layout = () => {
      W = el.offsetWidth + PAD * 2; H = el.offsetHeight + PAD * 2;
      const k = Math.min(window.devicePixelRatio || 1, 2) * (parseFloat(stage.style.zoom) || 1);
      canvas.width = Math.round(W * k); canvas.height = Math.round(H * k);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(k, 0, 0, k, 0, 0);
      const pt = (w) => ({ x: PAD + w.offsetLeft + w.offsetWidth / 2 + p.offsetLeft, y: PAD + w.offsetTop + p.offsetTop + 2 });
      from = pt(human); to = pt(ai);
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    const arcAt = (t) => {
      const cx = (from.x + to.x) / 2, cy = Math.min(from.y, to.y) - 22;
      const u = 1 - t;
      return { x: u * u * from.x + 2 * u * t * cx + t * t * to.x, y: u * u * from.y + 2 * u * t * cy + t * t * to.y };
    };
    const color = (t, a) => {
      // orange (human) -> violet -> blue (AI)
      const stops = [[249, 115, 22], [124, 60, 255], [0, 161, 224]];
      const s2 = t < 0.5 ? [stops[0], stops[1], t * 2] : [stops[1], stops[2], (t - 0.5) * 2];
      return `rgba(${Math.round(lerp(s2[0][0], s2[1][0], s2[2]))},${Math.round(lerp(s2[0][1], s2[1][1], s2[2]))},${Math.round(lerp(s2[0][2], s2[1][2], s2[2]))},${a})`;
    };

    let reveal = 0, speed = 1, hover = false, t = 0, last = 0, raf = 0, visible = false, started = false;
    const litUntil = { human: 0, ai: 0 };   // each word glows briefly after a signal lands on it
    const draw = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      speed += ((hover ? 1.7 : 1) - speed) * (1 - Math.exp(-dt / 0.3));
      t += dt * speed;
      reveal = Math.min(1, reveal + dt / 0.9);
      ctx.clearRect(0, 0, W, H);
      // the link: drawn in progressively on first reveal, dashed and flowing
      const grad = ctx.createLinearGradient(from.x, 0, to.x, 0);
      grad.addColorStop(0, 'rgba(249,115,22,0.55)'); grad.addColorStop(0.5, 'rgba(124,60,255,0.55)'); grad.addColorStop(1, 'rgba(0,161,224,0.55)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]); ctx.lineDashOffset = -t * 7;
      ctx.beginPath();
      const steps = 40;
      for (let i = 0; i <= steps * reveal; i++) { const q = arcAt(i / steps); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
      ctx.stroke(); ctx.setLineDash([]);
      // end points on the two words
      [[from, 0], [to, 1]].forEach(([q, c]) => {
        ctx.fillStyle = color(c, 0.9 * reveal);
        ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      // signal pulses: two each way, glowing heads with short trails
      if (reveal >= 1) {
        const PERIOD = 4.2;                 // seconds for a signal to cross
        [0, 0.5].forEach((off) => [1, -1].forEach((dir) => {
          const ph = ((t / PERIOD + off + (dir < 0 ? 0.25 : 0)) % 1);
          const pos = dir > 0 ? ph : 1 - ph;
          const fade = Math.sin(ph * Math.PI);
          for (let k = 0; k < 6; k++) {
            const tt = pos - dir * k * 0.018;
            if (tt < 0 || tt > 1) continue;
            const q = arcAt(tt);
            ctx.fillStyle = color(tt, (0.9 - k * 0.14) * fade);
            ctx.beginPath(); ctx.arc(q.x, q.y, k ? 1.6 - k * 0.18 : 2.4, 0, Math.PI * 2); ctx.fill();
          }
          if (ph > 0.93) litUntil[dir > 0 ? 'ai' : 'human'] = t + 0.5;
        }));
      }
      human.classList.toggle('is-lit', hover || t < litUntil.human);
      ai.classList.toggle('is-lit', hover || t < litUntil.ai);
      if (visible && !document.hidden) raf = requestAnimationFrame(draw); else raf = 0;
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(draw); } };

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started) {
        started = true;
        setTimeout(() => {
          layout();
          el.classList.add('is-in');                       // words focus in, one by one
          if (reduced) { reveal = 1; t = 0; draw(performance.now()); return; }
          setTimeout(wake, 700);
        }, startDelay);
      } else if (visible && started && !reduced) wake();
    }).observe(el);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && started && !reduced) wake(); });
    addEventListener('resize', () => { if (started) { align(); layout(); } });
    el.addEventListener('pointerenter', () => { hover = true; wake(); });
    el.addEventListener('pointerleave', () => { hover = false; });
  }
  aiLink($('306:2516'), 350);
  aiLink($('306:2106'), 250);

  /* ---------- Toast ---------- */
  const toast = document.createElement('div');
  toast.className = 'mi-toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let tt;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Ripple on press ---------- */
  function ripple(el, e) {
    if (reduced) return;
    const r = el.getBoundingClientRect();
    const z = parseFloat(stage.style.zoom) || 1;
    const size = Math.max(r.width, r.height) / z;
    const dot = document.createElement('span');
    dot.className = 'mi-ripple';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - r.left) / z - size / 2 + 'px';
    dot.style.top = (e.clientY - r.top) / z - size / 2 + 'px';
    el.style.overflow = 'hidden';
    el.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }

  function makeButton(el, onClick) {
    if (!el) return;
    el.classList.add('mi-press');
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.addEventListener('click', (e) => { ripple(el, e); onClick && onClick(e); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
  }

  /* ---------- Header ---------- */
  add($('306:2759'), 'mi-logo');
  const search = $('306:2752');
  if (search) {
    search.classList.add('mi-search');
    const label = $('306:2756');
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = label.textContent.trim();
    input.setAttribute('aria-label', 'Search');
    input.className = label.className;
    label.replaceWith(input);
    search.addEventListener('click', () => input.focus());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && input.value.trim()) notify(`Searching for “${input.value.trim()}”…`); });
  }
  const moon = $('306:2757');
  if (moon) {
    moon.classList.add('mi-moon');
    moon.setAttribute('role', 'button');
    moon.setAttribute('aria-label', 'Toggle theme');
    moon.tabIndex = 0;
    const root = document.documentElement;
    const icon = moon.querySelector('img');
    // The page background is a light colour mesh; the dark theme swaps in a deep
    // version of the same mesh so the soft variation survives.
    const bgMesh = $('306:2103') && $('306:2103').querySelector('canvas.mesh');
    const lightMesh = bgMesh && JSON.parse(bgMesh.dataset.mesh);
    const darkMesh = lightMesh && (() => {
      const d = JSON.parse(JSON.stringify(lightMesh));
      Object.keys(d).forEach((k) => {
        const c = d[k].color;
        if (!c) return;
        d[k].color = { r: 0.045 + (c.r - 0.88) * 0.45, g: 0.055 + (c.g - 0.88) * 0.45, b: 0.085 + (c.b - 0.88) * 0.6, a: 1 };
      });
      return d;
    })();
    const applyTheme = (dark) => {
      root.classList.toggle('dark', dark);
      icon.src = dark ? 'assets/ui-sun.svg' : 'assets/imgMoon.svg';
      moon.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      moon.setAttribute('aria-pressed', String(dark));
      if (bgMesh) window.setMeshParams(bgMesh, dark ? darkMesh : lightMesh);
      try { localStorage.setItem('bloom-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
    };
    let saved = null;
    try { saved = localStorage.getItem('bloom-theme'); } catch (e) { /* storage unavailable */ }
    if (saved === 'dark') applyTheme(true);

    const toggleTheme = () => {
      const next = !root.classList.contains('dark');
      moon.classList.remove('is-swapping'); void moon.offsetWidth; moon.classList.add('is-swapping');
      // Without view transitions (or with reduced motion) the colours simply fade.
      if (!document.startViewTransition || reduced) {
        root.classList.add('theme-anim');
        applyTheme(next);
        setTimeout(() => root.classList.remove('theme-anim'), 700);
        return;
      }
      // Water ripple: the new theme spreads from the button through a soft-edged circle
      // while rings roll outward over it.
      const r = moon.getBoundingClientRect();
      // centred on the button, kept on screen when the header has scrolled away
      const x = Math.min(innerWidth, Math.max(0, r.left + r.width / 2));
      const y = Math.min(innerHeight, Math.max(0, r.top + r.height / 2));
      const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.style.setProperty('--rx', `${x}px`);
      root.style.setProperty('--ry', `${y}px`);
      root.style.setProperty('--ripple-max', `${reach + 160}px`);
      let rings = null;
      const vt = document.startViewTransition(() => {
        applyTheme(next);
        rings = document.createElement('div');
        rings.className = 'mi-ripple-rings';
        rings.style.cssText = `--x:${x}px;--y:${y}px;--max:${reach + 60}px`;
        rings.innerHTML = '<span></span><span></span><span></span>';
        document.body.appendChild(rings);
      });
      vt.finished.finally(() => rings && rings.remove());
    };
    moon.addEventListener('click', toggleTheme);
    moon.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); } });
  }
  const profile = $('306:2283');
  if (profile) {
    profile.classList.add('mi-profile');
    add([$('306:2285'), profile.querySelector('[data-node-id="175:18464"]')], 'mi-chevron');
  }

  /* ---------- Sidebar: pinned while scrolling, named on hover ---------- */
  const NAV = [
    ['306:2767', 'Dashboard', null],
    ['306:2769', 'Messages', null],
    ['306:2774', 'Bloom Policy', '306:2517'],
    ['306:2776', 'Announcements', '325:3245'],
    ['306:2778', 'Notifications', '306:2828'],
    ['306:2780', 'Deals & Perks', '306:2706'],
    ['306:2782', 'Sports Groups', '306:2582'],
    ['ui:bookshelf', 'Bookshelf', () => { location.href = 'bookshelf.html'; }],
  ];
  const sideMenu = $('306:2764');
  const nav = [];
  NAV.forEach(([id, label, target]) => { const el = $(id); if (el) nav.push({ el, label, target, tipHost: el }); });
  const sports = document.querySelector('[data-name="Sports"]');
  // the last icon sits in a vertically mirrored wrapper, so its tooltip hangs off the unflipped parent
  if (sports) nav.push({ el: sports, label: 'Log out', target: null, tipHost: $('306:2784') || sports });

  nav.forEach(({ el, label, target, tipHost }, i) => {
    el.classList.add('mi-nav');
    if (i === 0) el.classList.add('is-active');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', label);
    el.tabIndex = 0;
    const tip = document.createElement('span');
    tip.className = 'mi-tip';
    tip.textContent = label;
    tip.setAttribute('aria-hidden', 'true');
    tipHost.classList.add('mi-tip-host');
    tipHost.appendChild(tip);
    el.addEventListener('mouseenter', () => tipHost.classList.add('show-tip'));
    el.addEventListener('mouseleave', () => tipHost.classList.remove('show-tip'));
    el.addEventListener('focus', () => tipHost.classList.add('show-tip'));
    el.addEventListener('blur', () => tipHost.classList.remove('show-tip'));
    el.addEventListener('click', () => {
      nav.forEach((n) => n.el.classList.remove('is-active'));
      el.classList.add('is-active');
      if (i === 0) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      else if (typeof target === 'function') target();
      else if (target && $(target)) {
        const y = $(target).getBoundingClientRect().top + scrollY - 40;
        scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      } else notify(`${label} is coming soon`);
    });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
  });

  // Pin the menu: lift it out of the zoomed artboard into a fixed rail that tracks the
  // artboard's left edge, and zoom the menu itself by the same factor so it keeps its size.
  if (sideMenu) {
    const rail = document.createElement('nav');
    rail.className = 'mi-rail';
    rail.setAttribute('aria-label', 'Main');
    sideMenu.classList.add('mi-sidenav');
    rail.appendChild(sideMenu);
    document.body.appendChild(rail);
    const place = () => {
      const z = parseFloat(stage.style.zoom) || 1;
      rail.style.left = stage.getBoundingClientRect().left * z + 'px';
      sideMenu.style.zoom = z;
    };
    place();
    addEventListener('resize', place);
  }

  /* ---------- Hero ---------- */
  add($('306:2290'), 'mi-hero');
  add($('306:2323'), 'mi-avatar');
  // The hero card's gradient drifts on its own and leans toward the cursor on hover
  const heroMesh = $('306:2293') && $('306:2293').querySelector('canvas.mesh');
  if (heroMesh) window.meshAmbient(heroMesh, $('306:2290'));
  $$(['306:2299', '306:2307', '306:2310', '306:2315']).forEach((el) => {
    el.classList.add('mi-chip');
    el.setAttribute('role', 'button');
    el.tabIndex = 0;
    el.addEventListener('click', (e) => ripple(el, e));
  });

  /* ---------- View All links ---------- */
  $$(['306:2144', '306:2522', '306:2712', '306:2686', '306:2830', '306:2679', '325:3247']).forEach((el) => {
    el.classList.add('mi-link');
    el.setAttribute('role', 'link');
    el.tabIndex = 0;
  });

  /* ---------- Horizontal scrollers: drag + vertical wheel ---------- */
  const perks = $('306:2687');
  if (perks) { perks.classList.remove('overflow-clip'); perks.style.overflowX = 'auto'; perks.style.overflowY = 'clip'; }
  $$(['306:2147', '306:2713', '306:2687', '306:2584']).forEach((el) => {
    el.classList.add('mi-scroll-x');
    let down = false, moved = false, sx = 0, sl = 0;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('dragging'); }
      if (moved) el.scrollLeft = sl - dx / (parseFloat(stage.style.zoom) || 1);
    });
    addEventListener('pointerup', () => { down = false; requestAnimationFrame(() => el.classList.remove('dragging')); });
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }, { passive: false });
  });
  add($$(['306:2523', '306:2831']), 'mi-scroll-y');

  /* ---------- Welcome to the Bloom Family ---------- */
  // Gradient letters (B L O O M) and the announcement banners: the mesh colours flow while hovered
  $$(['306:2148', '306:2175', '306:2202', '306:2229', '306:2256', '325:3251', '367:1471']).forEach((card) => {
    const canvas = card.querySelector('canvas.mesh');
    if (!canvas) return;
    const shape = canvas.parentElement;
    shape.classList.add('mi-letter');
    card.addEventListener('pointerenter', () => { window.setMeshFlow(canvas, true); card.classList.add('is-flowing'); });
    card.addEventListener('pointerleave', () => { window.setMeshFlow(canvas, false); card.classList.remove('is-flowing'); });
  });
  $$(['306:2159', '306:2186', '306:2213', '306:2240', '306:2267', '325:3256', '367:1477']).forEach((btn) => {
    btn.classList.add('mi-hello');
    add(btn.querySelector('[data-name="fi_15047490"]'), 'mi-hand');
    makeButton(btn, () => {
      const card = btn.closest('[data-name="1"],[data-name="2"],[data-name="3"],[data-name="4"],[data-name="5"]') || btn.parentElement.parentElement;
      const name = card.querySelector('p');
      btn.classList.add('mi-done');
      setTimeout(() => btn.classList.remove('mi-done'), 1600);
      const label = btn.querySelector('p').textContent.trim();
      notify(label === 'Say Hello' ? `👋 Hello sent to ${name ? name.textContent.trim() : 'your colleague'}` : '🎉 Your wishes have been sent');
    });
  });

  /* ---------- Joiner cards: open like a book on hover to a short profile ---------- */
  // Placeholder profile copy — replace with real details from HR.
  const PROFILES = {
    '306:2148': { team: 'Customer Care', joined: '14 Sep 2026', tags: ['Padel', 'Football', 'Coffee'],
      bio: 'Five years in customer care and a calm voice on every call. Ahmed joins Customer Care to make support faster and friendlier.' },
    '306:2175': { team: 'Marketing', joined: '17 Sep 2026', tags: ['Writing', 'Photography', 'Travel'],
      bio: 'Nada has spent six years telling brand stories across the region. She’ll lead our content calendar and internal newsletter.' },
    '306:2202': { team: 'Operations', joined: '21 Sep 2026', tags: ['Running', 'Chess', 'Strategy'],
      bio: 'A decade in operations leadership, building teams and processes that scale. Ask Ahmed about his favourite productivity habits.' },
    '306:2229': { team: 'Brand & Comms', joined: '22 Sep 2026', tags: ['Design', 'Books', 'Yoga'],
      bio: 'A storyteller from digital publishing, Samira will look after Bloom’s social channels and campaign content.' },
    '306:2256': { team: 'Marketing', joined: '23 Sep 2026', tags: ['Analytics', 'Cycling', 'Art'],
      bio: 'A final-year business student joining for a six-month internship, keen to learn how campaigns are planned and measured.' },
  };
  // Placeholder career history for the inner pages — replace with real details from HR.
  const HISTORY = {
    '306:2148': {
      exp: [['Customer Care Lead', 'Telecom provider · Dubai', '2023 – 2026'], ['Customer Service Agent', 'Hospitality group · Abu Dhabi', '2021 – 2023'], ['Call Centre Trainee', 'Retail bank · Dubai', '2020 – 2021']],
      edu: ['BA Business Administration', 'Class of 2020'], skills: ['CRM tools', 'Conflict resolution', 'Coaching'], langs: 'Arabic, English' },
    '306:2175': {
      exp: [['Content Lead', 'Lifestyle magazine · Dubai', '2022 – 2026'], ['Copywriter', 'Creative agency · Cairo', '2019 – 2022'], ['Editorial Intern', 'Daily newspaper · Cairo', '2018']],
      edu: ['BA Mass Communication', 'Class of 2018'], skills: ['Storytelling', 'SEO', 'Editing'], langs: 'Arabic, English, French' },
    '306:2202': {
      exp: [['Operations Manager', 'Logistics company · Jebel Ali', '2019 – 2026'], ['Operations Team Lead', 'Airport services · Dubai', '2015 – 2019'], ['Operations Analyst', 'Consulting firm · Riyadh', '2013 – 2015']],
      edu: ['MBA, Operations', 'Class of 2014'], skills: ['Process design', 'Lean', 'Team building'], langs: 'Arabic, English' },
    '306:2229': {
      exp: [['Social Media Manager', 'Digital publisher · Dubai', '2021 – 2026'], ['Content Producer', 'Media start-up · Sharjah', '2018 – 2021'], ['Junior Writer', 'Online magazine · Dubai', '2017']],
      edu: ['BA Journalism', 'Class of 2017'], skills: ['Social strategy', 'Video', 'Copywriting'], langs: 'Arabic, English, Urdu' },
    '306:2256': {
      exp: [['Marketing Assistant (part-time)', 'Retail brand · Riyadh', '2025'], ['Student Ambassador', 'University · Riyadh', '2024 – 2025'], ['Events Volunteer', 'Community programme', '2023']],
      edu: ['BBA Marketing (final year)', 'Graduating 2026'], skills: ['Research', 'Excel', 'Canva'], langs: 'Arabic, English' },
  };
  // The left page of an open book: a short intro "video" of the candidate. It plays a real
  // file when a profile has one (PROFILES[id].video), otherwise a motion intro built from the
  // card's own photo and details.
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';
  function makeIntro(host, { photo, video, captions }) {
    host.classList.add('mv');
    host.innerHTML = `
      <div class="mv-stage"><div class="mv-cam"></div></div>
      <div class="mv-shade"></div>
      <span class="mv-chip"><i></i>Intro</span>
      <div class="mv-captions"></div>
      <button type="button" class="mv-big" aria-label="Play intro">${ICON_PLAY}</button>
      <div class="mv-bar">
        <button type="button" class="mv-toggle" aria-label="Play intro">${ICON_PLAY}</button>
        <div class="mv-track"><div class="mv-fill"></div></div>
        <span class="mv-time">0:00</span>
      </div>`;
    const cam = host.querySelector('.mv-cam');
    let media = null;
    if (video) {
      media = document.createElement('video');
      Object.assign(media, { src: video, muted: true, loop: true, playsInline: true, preload: 'metadata' });
      cam.appendChild(media);
    } else if (photo) {
      cam.appendChild(photo);
    }
    captions.forEach(([big, small]) => {
      const c = document.createElement('div');
      c.className = 'mv-cap';
      c.innerHTML = '<p class="mv-cap-big"></p><p class="mv-cap-small"></p>';
      c.querySelector('.mv-cap-big').textContent = big;
      c.querySelector('.mv-cap-small').textContent = small;
      host.querySelector('.mv-captions').appendChild(c);
    });
    const caps = [...host.querySelectorAll('.mv-cap')];
    const fill = host.querySelector('.mv-fill');
    const time = host.querySelector('.mv-time');
    const SCENE = 3;                                   // seconds per caption in the motion intro
    const LENGTH = video ? 0 : SCENE * caps.length;
    let t = 0, playing = false, raf = 0, last = 0;
    const fmt = (sec) => `0:${String(Math.floor(sec)).padStart(2, '0')}`;
    const draw = () => {
      const dur = media ? media.duration || 0 : LENGTH;
      const now = media ? media.currentTime : t;
      const k = dur ? now / dur : 0;
      fill.style.transform = `scaleX(${k})`;
      time.textContent = `${fmt(now)} / ${fmt(dur)}`;
      if (!media) {
        host.style.setProperty('--k', k.toFixed(4));
        const scene = Math.min(caps.length - 1, Math.floor(now / SCENE));
        caps.forEach((c, i) => c.classList.toggle('is-on', i === scene && now % SCENE < SCENE - 0.35));
      }
    };
    const loop = (ts) => {
      if (!playing) return;
      // rAF timestamps can precede the performance.now() taken on play, so never step backwards
      if (!media) { t = (t + Math.min(0.05, Math.max(0, (ts - last) / 1000))) % LENGTH; }
      last = ts;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const setIcons = () => {
      host.classList.toggle('is-playing', playing);
      host.querySelector('.mv-toggle').innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      ['.mv-toggle', '.mv-big'].forEach((sel) => host.querySelector(sel).setAttribute('aria-label', playing ? 'Pause intro' : 'Play intro'));
    };
    const api = {
      play() { if (playing) return; playing = true; if (media) media.play().catch(() => {}); last = performance.now(); raf = requestAnimationFrame(loop); setIcons(); },
      pause() { playing = false; cancelAnimationFrame(raf); if (media) media.pause(); setIcons(); },
      reset() { api.pause(); t = 0; if (media) media.currentTime = 0; caps.forEach((c) => c.classList.remove('is-on')); draw(); },
      toggle() { playing ? api.pause() : api.play(); },
    };
    host.querySelector('.mv-toggle').addEventListener('click', (e) => { e.stopPropagation(); api.toggle(); });
    host.querySelector('.mv-big').addEventListener('click', (e) => { e.stopPropagation(); api.play(); });
    host.querySelector('.mv-stage').addEventListener('click', (e) => { e.stopPropagation(); api.toggle(); });
    // scrub by clicking the progress bar
    host.querySelector('.mv-track').addEventListener('click', (e) => {
      e.stopPropagation();
      const r = e.currentTarget.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      if (media) { if (media.duration) media.currentTime = k * media.duration; } else t = k * LENGTH * 0.999;
      draw();
    });
    draw();
    return api;
  }

  const memberScroller = $('306:2147');
  add(memberScroller, 'mi-scroll-3d');

  Object.entries(PROFILES).forEach(([id, info]) => {
    const card = $(id);
    if (!card) return;
    const texts = card.querySelectorAll('p');
    const name = texts[0].textContent.trim();
    const role = texts[1].textContent.trim();
    const frontHello = card.querySelector('.mi-hello');

    // Rebuild as a book: the profile page underneath, and the original card as a cover
    // hinged on its left edge (outside face = the design, inside face = endpaper)
    const cover = document.createElement('div');
    cover.className = 'mi-cover';
    const front = document.createElement('div');
    front.className = 'mi-cover-face mi-cover-front';
    front.append(...card.childNodes);
    const inside = document.createElement('div');
    inside.className = 'mi-cover-face mi-cover-inside';
    // the intro re-uses the card's cut-out photo, in the same spot it sits on the front
    const photoSrc = front.querySelector('[data-name^="image"]');
    let photo = null;
    if (photoSrc) {
      photo = photoSrc.cloneNode(true);
      photo.removeAttribute('data-node-id');
      photo.querySelectorAll('[data-node-id]').forEach((n) => n.removeAttribute('data-node-id'));
      photo.classList.add('mv-photo');
    }
    const firstName = name.split(' ')[0];
    card._intro = makeIntro(inside, {
      photo,
      video: info.video,
      captions: [[`Hi, I'm ${firstName}`, 'Welcome to the Bloom family'], [role, `${info.team} team`], [`Joined ${info.joined}`, 'Say hello on Teams']],
    });
    cover.append(front, inside);
    const back = document.createElement('div');
    back.className = 'mi-sheet mi-leaf-face mi-leaf-front';
    back.innerHTML = `
      <div class="mb-head"><p class="mb-name"></p><p class="mb-role"></p></div>
      <p class="mb-bio"></p>
      <dl class="mb-facts">
        <div><dt>Team</dt><dd class="mb-team"></dd></div>
        <div><dt>Joined</dt><dd class="mb-joined"></dd></div>
      </dl>
      <ul class="mb-tags"></ul>
      <div class="mb-hello mi-hello"><img class="mi-hand" alt="" src="assets/imgGroup3.svg"><p>Say Hello</p></div>`;
    back.querySelector('.mb-name').textContent = name;
    back.querySelector('.mb-role').textContent = role;
    back.querySelector('.mb-bio').textContent = info.bio;
    back.querySelector('.mb-team').textContent = info.team;
    back.querySelector('.mb-joined').textContent = info.joined;
    info.tags.forEach((t) => { const li = document.createElement('li'); li.textContent = t; back.querySelector('.mb-tags').appendChild(li); });

    // Inner pages: the profile leaf turns over to show previous experience, with
    // education and skills on the page beneath it.
    const hist = HISTORY[id];
    const leaf = document.createElement('div');
    leaf.className = 'mi-leaf';
    const leafBack = document.createElement('div');
    leafBack.className = 'mi-sheet mi-leaf-face mi-leaf-back';
    leafBack.innerHTML = '<p class="mp-title">Previous experience</p><ol class="mp-timeline"></ol><span class="mi-folio">2</span>';
    hist.exp.forEach(([title, org, years]) => {
      const li = document.createElement('li');
      li.innerHTML = '<span class="mp-years"></span><p class="mp-role"></p><p class="mp-org"></p>';
      li.querySelector('.mp-years').textContent = years;
      li.querySelector('.mp-role').textContent = title;
      li.querySelector('.mp-org').textContent = org;
      leafBack.querySelector('.mp-timeline').appendChild(li);
    });
    leaf.append(back, leafBack);

    const page = document.createElement('div');
    page.className = 'mi-sheet mi-page';
    page.innerHTML = `
      <p class="mp-title">Education &amp; skills</p>
      <div class="mp-block"><span class="mp-label">Education</span><p class="mp-role"></p><p class="mp-org"></p></div>
      <div class="mp-block"><span class="mp-label">Skills</span><ul class="mb-tags"></ul></div>
      <div class="mp-block"><span class="mp-label">Languages</span><p class="mp-role mp-langs"></p></div>
      <span class="mi-folio">3</span>`;
    page.querySelector('.mp-block .mp-role').textContent = hist.edu[0];
    page.querySelector('.mp-block .mp-org').textContent = hist.edu[1];
    page.querySelector('.mp-langs').textContent = hist.langs;
    hist.skills.forEach((t) => { const li = document.createElement('li'); li.textContent = t; page.querySelector('.mb-tags').appendChild(li); });

    card.append(page, leaf, cover);
    card.classList.add('mi-book');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `${name}, ${role}. Open profile`);
    if (frontHello) frontHello.tabIndex = -1;

    const backHello = back.querySelector('.mb-hello');
    makeButton(backHello, (e) => {
      e.stopPropagation();
      backHello.classList.add('mi-done');
      setTimeout(() => backHello.classList.remove('mi-done'), 1600);
      notify(`👋 Hello sent to ${name}`);
    });

    card.addEventListener('click', () => { if (!card.classList.contains('in-modal')) openBook(card); });
    card.addEventListener('keydown', (e) => {
      if (e.target === card && (e.key === 'Enter' || e.key === ' ') && !card.classList.contains('in-modal')) { e.preventDefault(); openBook(card); }
    });
  });

  // Click a joiner card: it lifts out of the row, glides to the middle of the screen a
  // little larger, then opens like a book into a two-page spread. Closing reverses it.
  let bookBusy = false;
  function openBook(card) {
    if (bookBusy) return;
    bookBusy = true;
    const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const W = 240, H = 350;
    const rect = card.getBoundingClientRect();
    const z = rect.width / W;
    // about twice the card's on-screen size (never below 1.4x its real size), capped so the spread fits the window
    const S = Math.min(Math.max(z * 2.2, 1.4), (innerWidth * 0.94) / (W * 2), (innerHeight * 0.88) / H);
    const cx = innerWidth / 2, cy = innerHeight / 2;
    const at = (x, y, k) => `translate(${x}px, ${y}px) scale(${k})`;
    const home = () => { const r = placeholder.getBoundingClientRect(); return at(r.left, r.top, r.width / W); };
    const closedMid = at(cx - (W * S) / 2, cy - (H * S) / 2, S);
    const spread = at(cx, cy - (H * S) / 2, S);   // spine on the centre line, cover open to its left

    const placeholder = document.createElement('div');
    placeholder.style.cssText = `width:${W}px;height:${H}px;flex:none`;
    card.before(placeholder);

    const modal = document.createElement('div');
    modal.className = 'mi-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', card.querySelector('.mb-name').textContent + ' profile');
    modal.innerHTML = '<div class="mi-modal-backdrop"></div><button class="mi-modal-close" type="button" aria-label="Close">&times;</button>';
    document.body.appendChild(modal);
    modal.appendChild(card);
    card.classList.add('in-modal');
    card.style.transform = at(rect.left, rect.top, z);
    // Page turning: scroll, arrow keys, swipe or the buttons. The page underneath never
    // scrolls while the book is open.
    const leaves = [...card.querySelectorAll('.mi-leaf')];
    let turned = 0, turning = false, wheelAcc = 0, touchX = null;
    const nav = document.createElement('div');
    nav.className = 'mi-book-nav';
    nav.innerHTML = '<button type="button" class="mi-nav-prev" aria-label="Previous page">&#8249;</button><span class="mi-nav-count"></span><button type="button" class="mi-nav-next" aria-label="Next page">&#8250;</button><span class="mi-nav-hint">Scroll to turn the page</span>';
    modal.appendChild(nav);
    const syncNav = () => {
      nav.querySelector('.mi-nav-count').textContent = `${turned + 1} / ${leaves.length + 1}`;
      nav.querySelector('.mi-nav-prev').disabled = turned === 0;
      nav.querySelector('.mi-nav-next').disabled = turned === leaves.length;
    };
    const stackLeaves = () => leaves.forEach((l, i) => { l.style.zIndex = l.classList.contains('is-turned') ? 40 + i : 20 + (leaves.length - i); });
    stackLeaves();
    syncNav();
    const turn = (dir) => {
      if (turning || bookBusy || !modal.classList.contains('is-ready')) return;
      const i = dir > 0 ? turned : turned - 1;
      const leaf = leaves[i];
      if (!leaf) return;
      turning = true;
      leaf.style.zIndex = 60;                      // swings over everything while it turns
      leaf.classList.toggle('is-turned', dir > 0);
      leaf.classList.remove('is-moving'); void leaf.offsetWidth; leaf.classList.add('is-moving');
      turned += dir > 0 ? 1 : -1;
      syncNav();
      // the intro is on the first spread only: pause it while a page covers it
      if (card._intro) { if (turned === 0 && !reduced) setTimeout(() => card._intro.play(), 600); else card._intro.pause(); }
      setTimeout(() => { leaf.classList.remove('is-moving'); stackLeaves(); turning = false; }, reduced ? 20 : 900);
    };
    modal.addEventListener('wheel', (e) => {
      e.preventDefault();
      wheelAcc += e.deltaY || e.deltaX;
      if (Math.abs(wheelAcc) > 40) { turn(Math.sign(wheelAcc)); wheelAcc = 0; }
    }, { passive: false });
    modal.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    modal.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    modal.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1);
      touchX = null;
    });
    nav.querySelector('.mi-nav-prev').addEventListener('click', () => turn(-1));
    nav.querySelector('.mi-nav-next').addEventListener('click', () => turn(1));
    requestAnimationFrame(() => modal.classList.add('is-shown'));

    const move = (from, to, duration) => card.animate([{ transform: from }, { transform: to }], { duration: reduced ? 1 : duration, easing: EASE, fill: 'forwards' }).finished.then(() => { card.style.transform = to; card.getAnimations().forEach((a) => a.cancel()); });

    let closing = false;
    const close = async () => {
      if (closing || bookBusy) return;
      closing = bookBusy = true;
      document.removeEventListener('keydown', onKey);
      modal.classList.remove('is-ready');
      if (card._intro) card._intro.reset();
      if (turned) {                                     // turn the pages back before the cover shuts
        leaves.forEach((l) => l.classList.remove('is-turned'));
        turned = 0;
        await new Promise((r) => setTimeout(r, reduced ? 20 : 650));
        stackLeaves();
      }
      card.classList.remove('is-open');                 // cover swings shut
      await move(spread, closedMid, 750);
      modal.classList.remove('is-shown');               // backdrop fades as it flies home
      await move(closedMid, home(), 480);
      card.classList.remove('in-modal');
      card.style.transform = '';
      placeholder.replaceWith(card);
      modal.remove();
      card.focus({ preventScroll: true });
      bookBusy = false;
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); turn(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(-1); }
    };
    document.addEventListener('keydown', onKey);
    modal.querySelector('.mi-modal-backdrop').addEventListener('click', close);
    modal.querySelector('.mi-modal-close').addEventListener('click', close);

    (async () => {
      await move(at(rect.left, rect.top, z), closedMid, 560);
      card.classList.add('is-open');                    // cover opens to a flat spread
      await move(closedMid, spread, 1000);
      modal.querySelector('.mi-modal-close').focus({ preventScroll: true });
      modal.classList.add('is-ready');
      if (card._intro && !reduced) card._intro.play();
      bookBusy = false;
    })();
  }

  /* ---------- Announcements ---------- */
  add($$(['325:3251', '367:1471']), 'mi-lift');
  $$(['325:3251', '367:1471']).forEach((el) => (el.style.borderRadius = '30px'));

  /* ---------- Explore Bloom Policy ---------- */
  [['306:2524', '306:2526', '306:2533'], ['306:2537', '306:2539', '306:2549'], ['306:2553', '306:2555', '306:2563'], ['306:2567', '306:2569', '306:2578']].forEach(([row, thumb, arrow]) => {
    add($(row), 'mi-policy');
    add($(thumb), 'mi-thumb');
    add($(arrow), 'mi-arrow');
  });

  /* ---------- Exclusive Deals ---------- */
  $$(['306:2714', '306:2719', '306:2726', '306:2733', '306:2740']).forEach((el) => el.classList.add('mi-deal'));

  /* ---------- Workplace Perks ---------- */
  $$(['306:2688', '306:2694', '306:2700']).forEach((card) => {
    card.classList.add('mi-zoom');
    card.querySelectorAll('img').forEach((img) => img.classList.add('mi-zoom-target'));
  });
  $$(['306:2692', '306:2698', '306:2704']).forEach((b) => makeButton(b));

  /* ---------- Sports Groups ---------- */
  $$(['306:2585', '306:2601', '306:2616', '306:2631', '306:2646', '306:2661']).forEach((card) => {
    card.classList.add('mi-lift');
    card.style.borderRadius = '24px';
  });
  $$(['306:2595', '306:2610', '306:2625', '306:2640', '306:2655', '306:2670']).forEach((btn) => {
    const label = btn.querySelector('p');
    const original = label.textContent.trim();
    makeButton(btn, () => {
      const joined = btn.classList.toggle('mi-done');
      label.textContent = joined ? 'Joined ✓' : original;
      // group title is the first text in the card outside the avatars + Join row
      const group = [...btn.closest('.mi-lift').querySelectorAll('p')].find((p) => !btn.parentElement.contains(p));
      if (joined) notify(`You joined ${group ? group.textContent.trim() : 'the group'}`);
    });
  });

  /* ---------- Your Attention Required ---------- */
  const list = $('306:2831');
  const countEl = $('306:3012') && $('306:3012').querySelectorAll('span')[1];
  const allTab = $('306:2998');
  let count = countEl ? parseInt(countEl.textContent, 10) : 0;
  if (countEl) countEl.classList.add('mi-count');

  function setCount(n) {
    count = n;
    if (!countEl) return;
    countEl.textContent = n;
    if (allTab) allTab.textContent = `ALL ${n}`;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 250);
  }

  // Count-up on load
  if (countEl && !reduced) {
    const target = count, t0 = performance.now() + 800;
    countEl.textContent = '0';
    (function tick(now) {
      const p = Math.min(1, Math.max(0, (now - t0) / 900));
      countEl.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  if (list) {
    const rows = [...list.children];
    rows.forEach((row) => {
      row.classList.add('mi-row');
      row.querySelectorAll('div').forEach((b) => {
        const t = b.children.length === 1 && b.firstElementChild.tagName === 'P' ? b.textContent.trim() : '';
        if (t === 'Approve' || t === 'Reject') {
          b.classList.add(t === 'Approve' ? 'mi-approve' : 'mi-reject');
          makeButton(b, () => resolve(row, t === 'Approve'));
        } else if (t === 'Update FRI') {
          b.classList.add('mi-update');
          makeButton(b, () => notify('Opening FRI update…'));
        }
      });
    });

    function resolve(row, approved) {
      if (row.dataset.resolved) return;
      row.dataset.resolved = '1';
      const title = row.querySelector('p').textContent.trim();
      row.classList.add(approved ? 'is-approved' : 'is-rejected');
      setTimeout(() => {
        row.style.height = row.offsetHeight + 'px';
        row.classList.add('is-leaving');
        setTimeout(() => row.classList.add('is-collapsed'), 260);
        setTimeout(() => { row.remove(); }, 700);
        setCount(Math.max(0, count - 1));
      }, 380);
      notify(`${approved ? '✓ Approved' : '✕ Rejected'}: ${title}`);
    }

    // Tabs with sliding underline
    const tabs = [...$('306:2996').children];
    const underline = $('306:3011');
    underline.classList.add('mi-underline');
    const bar = $('306:2995');
    function moveUnderline(tab) {
      const z = parseFloat(stage.style.zoom) || 1;
      const b = bar.getBoundingClientRect(), p = tab.querySelector('p').getBoundingClientRect();
      underline.style.left = (p.left - b.left) / z + 'px';
      underline.style.width = p.width / z + 'px';
    }
    tabs.forEach((tab) => {
      tab.classList.add('mi-tab');
      tab.setAttribute('role', 'tab');
      tab.tabIndex = 0;
      tab.addEventListener('click', () => {
        if (tab.classList.contains('is-active')) return;
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        moveUnderline(tab);
        [...list.children].forEach((row, i) => {
          row.classList.remove('is-entering'); void row.offsetWidth;
          row.style.setProperty('--d', i * 0.04 + 's');
          row.classList.add('is-entering');
        });
        list.scrollTo({ top: 0, behavior: 'smooth' });
      });
      tab.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); } });
    });
    tabs[0].classList.add('is-active');

    // Hover settle for the whole panel
    const panel = $('306:2828');
    add(panel, 'mi-panel');
    add($('306:2829'), 'mi-panel-bg');
    panel.addEventListener('pointerenter', () => {
      panel.classList.remove('is-settling'); void panel.offsetWidth;
      panel.classList.add('is-settling', 'is-settled');
    });
    panel.addEventListener('pointerleave', () => panel.classList.remove('is-settled'));
    panel.addEventListener('animationend', (e) => { if (e.target === $('306:2829')) panel.classList.remove('is-settling'); });
  }

  /* ---------- "Bloom" watermark: each letter lifts and fills with gradient on hover ---------- */
  const mark = $('306:2105');
  const word = mark && mark.querySelector('p');
  if (word) {
    const text = word.textContent.trim();
    word.setAttribute('aria-label', text);
    word.textContent = '';
    const letters = [...text].map((ch) => {
      const span = document.createElement('span');
      span.className = 'mi-l';
      span.dataset.l = ch;
      span.textContent = ch;
      span.setAttribute('aria-hidden', 'true');
      word.appendChild(span);
      return span;
    });
    mark.classList.add('mi-mark');

    // Fluid response: every letter reads the cursor's distance, so the lift and the glow
    // fall off smoothly across the word, and each letter settles on its own spring.
    const MAX_LIFT = 26;        // px the letter under the cursor rises
    const REACH = 0.9;          // falloff width, in letter-widths
    const STIFF = 180, DAMP = 16;
    const state = letters.map(() => ({ y: 0, vy: 0, g: 0, tilt: 0 }));
    let pointer = null, lastX = null, vx = 0, raf = 0, last = 0;

    const tick = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      vx *= Math.exp(-dt / 0.12);   // cursor speed decays when it stops
      let moving = false;
      letters.forEach((span, i) => {
        const st = state[i];
        let target = 0, glow = 0, lean = 0;
        if (pointer) {
          const r = span.getBoundingClientRect();
          const d = (pointer.x - (r.left + r.width / 2)) / (r.width * REACH + 1);
          const f = Math.exp(-d * d);                 // gaussian falloff
          target = MAX_LIFT * f;
          glow = f;
          lean = Math.max(-1, Math.min(1, d)) * f * -4 + Math.max(-6, Math.min(6, vx * 0.004)) * f;
        }
        st.vy += (STIFF * (target - st.y) - DAMP * st.vy) * dt;
        st.y += st.vy * dt;
        st.g += (glow - st.g) * (1 - Math.exp(-dt / 0.18));
        st.tilt += (lean - st.tilt) * (1 - Math.exp(-dt / 0.15));
        span.style.setProperty('--lift', st.y.toFixed(2));
        span.style.setProperty('--glow', st.g.toFixed(3));
        span.style.setProperty('--tilt', st.tilt.toFixed(2));
        if (Math.abs(st.y - target) > 0.05 || Math.abs(st.vy) > 0.05 || Math.abs(st.g - glow) > 0.002 || Math.abs(st.tilt - lean) > 0.02) moving = true;
      });
      mark.classList.toggle('is-live', state.some((st) => st.g > 0.01));
      raf = moving || pointer ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

    if (!reduced) mark.addEventListener('pointermove', (e) => {
      if (lastX !== null) vx = vx * 0.6 + (e.clientX - lastX) * 60 * 0.4;
      lastX = e.clientX;
      pointer = { x: e.clientX };
      wake();
    });
    mark.addEventListener('pointerleave', () => { pointer = null; lastX = null; wake(); });
  }

  /* ---------- Footer ---------- */
  add($$(['306:2122', '306:2131']), 'mi-store');
  add($$(['306:2113', '306:2115', '306:2117', '306:2119']), 'mi-social');
  add($$(['306:2109', '306:2110']), 'mi-foot-link');
})();
