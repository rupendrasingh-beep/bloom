// Pizza kiosk — rendering, fluid bubble navigation and micro-interactions.
(() => {
  'use strict';

  const ASSETS = '/dominos/assets/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Data (from the Figma frame) ----------

  // Image boxes are each item's position inside its 150 × 150 slot in the design.
  const CATEGORIES = [
    { id: 'best-sellers', label: 'Best Sellers', title: 'Explore Best Sellers', img: 'nav-best-sellers.png', w: 147, h: 118, x: 2, y: 0 },
    { id: 'pizza', label: 'Pizza', title: 'Explore Pizza Flavors', img: 'nav-pizza.png', w: 146, h: 115, x: 5, y: 0 },
    { id: 'pasta', label: 'Pasta', title: 'Explore Pasta', img: 'nav-pasta.png', w: 149, h: 99, x: 0, y: 9 },
    { id: 'chicken', label: 'Chicken', title: 'Explore Chicken', img: 'nav-chicken.png', w: 149, h: 100, x: 0.5, y: 9 },
    { id: 'drinks', label: 'Drinks', title: 'Explore Drinks', img: 'nav-drinks.png', w: 149, h: 114, x: 0.5, y: 0 },
    { id: 'desserts', label: 'Desserts', title: 'Explore Desserts', img: 'nav-desserts.png', w: 148, h: 99, x: 1, y: 0 },
    { id: 'extras', label: 'Extras', title: 'Explore Extras', img: 'nav-extras.png', w: 149, h: 106, x: 0.5, y: 0 },
  ];

  const CHIPS = [
    { id: 'popular', label: 'Popular', img: 'chip-popular.png', w: 150, iw: 24, ih: 24 },
    { id: 'new', label: 'New Launch', img: 'chip-new-launch.png', w: 182, iw: 24, ih: 24 },
    { id: 'veg', label: 'Veg', img: 'chip-veg.png', w: 110, iw: 24, ih: 24 },
    { id: 'nonveg', label: 'Non-Veg', img: 'chip-non-veg.png', w: 140, iw: 21, ih: 22 },
    { id: 'cheesy', label: 'Cheesy', img: 'chip-cheesy.png', w: 140, iw: 19, ih: 18 },
  ];

  const P = {
    jalapeno: { name: 'Jalapeno Pepperoni', desc: 'Pizza Sauce, mozzarella, beef pepperoni & jalapeno', cal: 453, price: '49.90', veg: false, img: 'pizza-jalapeno-pepperoni.png', box: [0, 2.37, 162.744, 150.104] },
    margherita: { name: 'Margherita', desc: 'Simply topped with lots of melted mozzarella goodness', cal: 323, price: '39.90', veg: true },
    legend: { name: 'Legend Chicken Ranch', desc: 'American cheese, grilled chicken breast, onions, mozzarella, oregano with ranch sauce', cal: 398, price: '49.90', veg: false, img: 'pizza-legend-chicken-ranch.png' },
    dynamite: { name: 'Chicken Dynamite', desc: 'American cheese, green peppers, onions, crunchy chicken breast, mozzarella, oregano with dynamite sauce', cal: 528, price: '49.90', veg: false, img: 'pizza-chicken-dynamite.png', box: [3.55, 0.17, 155, 147] },
    veggie: { name: 'Veggie', desc: 'Pizza sauce, mozzarella, onions, green peppers, mushrooms & black olives', cal: 321, price: '49.90', veg: true, img: 'pizza-veggie.png' },
    alfredo: { name: 'Alfredo', desc: 'Original alfredo sauce, grilled chicken breast pieces, mozzarella cheese, slices of fresh mushroom', cal: 421, price: '49.90', veg: true, img: 'pizza-alfredo.png' },
    tikka: { name: 'Chicken Tikka', desc: 'Pizza sauce, mozzarella, chicken tikka, onions, green peppers with mint sauce', cal: 623, price: '49.90', veg: false, img: 'pizza-chicken-tikka.png' },
    deluxe: { name: 'Deluxe', desc: 'Pizza sauce, mozzarella, beef pepperoni, onions, green peppers, mushrooms & Italian sausage', cal: 598, price: '49.90', veg: false, img: 'pizza-deluxe.png' },
    hotspicy: { name: 'Hot & Spicy', desc: 'Pizza sauce, mozzarella, onions, green peppers, jalapeno & beef', cal: 623, price: '49.90', veg: false, img: 'pizza-hot-spicy.png' },
  };

  // Rows exactly as laid out in the design. `isNew` shows the "New Launch" tag.
  const LAYOUT = [
    { items: [['jalapeno'], ['margherita'], ['legend']] },
    'banner',
    { items: [['dynamite'], ['veggie', { isNew: true }], ['alfredo']] },
    { items: [['tikka', { isNew: true }], ['deluxe'], ['hotspicy']], compactBtn: true },
    { items: [['dynamite'], ['veggie'], ['alfredo']], compactBtn: true, smallName: true },
    { items: [['jalapeno'], ['margherita'], ['legend']], compactBtn: true, smallName: true },
  ];

  // ---------- Helpers ----------

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---------- Fit the 1080 × 1920 stage to the screen ----------

  const stage = $('#stage');
  function fit() {
    const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.setProperty('--scale', s.toFixed(4));
  }
  window.addEventListener('resize', fit);
  fit();

  // ---------- Render the menu ----------

  const grid = $('#grid');
  const chipsEl = $('#chips');

  function cardHTML(key, opts) {
    const p = P[key];
    const overlay = p.img
      ? (() => {
          const [x, y, w, h] = p.box || [0, 0, 162.744, 154.844];
          return `<img src="${ASSETS}${p.img}" alt="" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">`;
        })()
      : '';
    const tag = opts.isNew
      ? `<div class="card__tag"><img src="${ASSETS}new-launch-tag.png" alt=""><span>New Launch</span></div>`
      : '';
    return `
      <div class="card__bg"></div>
      <div class="card__cal"><img src="${ASSETS}calories.png" width="19" height="19" alt="">${p.cal} cal.</div>
      <div class="card__pizza"><img class="base" src="${ASSETS}pizza-margherita.png" alt="">${overlay}</div>
      ${tag}
      <img class="card__diet" src="${ASSETS}${p.veg ? 'diet-veg' : 'diet-non-veg'}.png" alt="${p.veg ? 'Vegetarian' : 'Non-vegetarian'}">
      <h3 class="card__name">${esc(p.name)}</h3>
      <p class="card__desc">${esc(p.desc)}</p>
      <div class="card__rule"></div>
      <div class="card__buy">
        <span class="card__price">AED ${p.price}</span>
        <button class="add" type="button" aria-label="Add ${esc(p.name)}">
          <img src="${ASSETS}bag.png" alt=""><span>Add</span>
        </button>
      </div>`;
  }

  function renderGrid() {
    grid.innerHTML = '';
    LAYOUT.forEach((row) => {
      if (row === 'banner') {
        const b = el('div', 'banner reveal', `
          <div class="banner__frame">
            <div class="banner__bg"><img src="${ASSETS}banner-bg.png" alt=""></div>
            <img class="banner__title" src="${ASSETS}banner-title.png" alt="Everyday value — large pizzas 34.90 each">
          </div>
          <img class="banner__dots" src="${ASSETS}banner-dots.png" alt="">`);
        grid.appendChild(b);
        return;
      }
      const r = el('div', 'row');
      row.items.forEach(([key, opts = {}], i) => {
        const c = el('article', 'card reveal');
        if (row.compactBtn) c.classList.add('card--compact-btn');
        if (row.smallName) c.classList.add('card--small-name');
        c.dataset.veg = P[key].veg ? '1' : '0';
        c.dataset.new = opts.isNew ? '1' : '0';
        c.style.setProperty('--d', `${i * 90}ms`);
        c.innerHTML = cardHTML(key, opts);
        r.appendChild(c);
      });
      grid.appendChild(r);
    });
    observeReveals();
    applyFilter();
  }

  function renderChips() {
    CHIPS.forEach((c) => {
      const b = el('button', `chip chip--${c.id}`);
      b.type = 'button';
      b.style.width = `${c.w}px`;
      b.dataset.chip = c.id;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<img src="${ASSETS}${c.img}" width="${c.iw}" height="${c.ih}" alt=""><span>${c.label}</span>`;
      chipsEl.appendChild(b);
    });
  }

  // ---------- Entrance reveal ----------

  const content = $('#content');
  let io;
  function observeReveals() {
    if (io) io.disconnect();
    const nodes = grid.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { root: content, threshold: 0.12 });
    nodes.forEach((n) => io.observe(n));
  }

  // ---------- Filters ----------

  let activeChip = null;
  function applyFilter() {
    grid.querySelectorAll('.card').forEach((c) => {
      let match = true;
      if (activeChip === 'veg') match = c.dataset.veg === '1';
      else if (activeChip === 'nonveg') match = c.dataset.veg === '0';
      else if (activeChip === 'new') match = c.dataset.new === '1';
      c.classList.toggle('is-dim', !match);
    });
  }
  chipsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    activeChip = activeChip === b.dataset.chip ? null : b.dataset.chip;
    chipsEl.querySelectorAll('.chip').forEach((c) => {
      const on = c.dataset.chip === activeChip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    applyFilter();
  });

  // ---------- Add to order ----------

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const scale = r.width / btn.offsetWidth || 1;
    const ripple = el('span', 'add__ripple');
    ripple.style.left = `${(e.clientX - r.left) / scale || btn.offsetWidth / 2}px`;
    ripple.style.top = `${(e.clientY - r.top) / scale || btn.offsetHeight / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    const card = btn.closest('.card');
    const label = btn.querySelector('span');
    btn.classList.add('is-added');
    card.classList.remove('is-added');
    void card.offsetWidth;
    card.classList.add('is-added');
    label.textContent = 'Added';
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      btn.classList.remove('is-added');
      card.classList.remove('is-added');
      label.textContent = 'Add';
    }, 1400);
  });

  // ---------- Title ----------

  const titleEl = $('#title');
  function setTitle(text, animate) {
    titleEl.setAttribute('aria-label', text);
    if (!animate || reduceMotion) {
      titleEl.textContent = text;
      return;
    }
    titleEl.innerHTML = [...text]
      .map((ch, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${ch === ' ' ? ' ' : esc(ch)}</span>`)
      .join('');
  }

  // ---------- Fluid bubble navigation ----------

  const list = $('#catList');
  const goo = $('.goo', list);
  const blob = $('#blob');
  const drops = [...goo.querySelectorAll('.goo__drop')];

  CATEGORIES.forEach((c) => {
    const b = el('button', 'cat');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.id = c.id;
    b.innerHTML = `
      <img class="cat__img" src="${ASSETS}${c.img}" width="${c.w}" height="${c.h}" alt="" style="left:${c.x}px;top:${c.y}px">
      <span class="cat__label">${c.label}</span>`;
    list.appendChild(b);
  });
  const cats = [...list.querySelectorAll('.cat')];

  const BLOB_W = 149;
  const BLOB_H = 203;
  const BLOB_OFFSET = -28; // the bubble starts 28px above the item (Figma: bubble y 247, item y 275)
  const GOO_LEFT = 16; // .goo is shifted 16px left to give the blur room
  const DROP_SIZES = [86, 64, 44];

  // Spring state. Each droplet follows the bubble on a looser spring so it trails behind
  // and pinches off like liquid; the gooey filter melts them back together on arrival.
  const sim = {
    y: 0, v: 0, target: 0,
    sy: 1, sv: 0, // vertical stretch spring (jelly wobble)
    drops: DROP_SIZES.map((d, i) => ({ y: 0, v: 0, k: [120, 80, 52][i], c: [13, 10.5, 8.5][i], d })),
    running: false,
    last: 0,
  };
  drops.forEach((d, i) => { d.style.width = d.style.height = `${DROP_SIZES[i]}px`; });

  function blobTargetFor(btn) {
    return btn.offsetTop + BLOB_OFFSET;
  }

  function paint() {
    const stretch = sim.sy - 1;
    const sx = 1 - Math.max(-0.08, Math.min(0.2, stretch * 0.55));
    blob.style.transform = `translate3d(0, ${sim.y}px, 0) scale(${sx}, ${sim.sy})`;
    sim.drops.forEach((dr, i) => {
      // Droplets swell a little as they lag behind, like a stretching strand.
      const grow = 1 + Math.min(0.35, Math.abs(dr.y - sim.y) / 600);
      drops[i].style.transform = `translate3d(${(BLOB_W - dr.d) / 2}px, ${dr.y + (BLOB_H - dr.d) / 2}px, 0) scale(${grow})`;
    });
  }

  function step(now) {
    const dt = Math.min(0.033, (now - sim.last) / 1000 || 0.016);
    sim.last = now;

    // Main bubble: snappy, slightly under-damped.
    const k = 210, c = 22;
    const a = k * (sim.target - sim.y) - c * sim.v;
    sim.v += a * dt;
    sim.y += sim.v * dt;

    // Stretch follows speed, then wobbles back to round via its own spring.
    const want = 1 + Math.min(0.32, Math.abs(sim.v) / 2600);
    const sa = 260 * (want - sim.sy) - 11 * sim.sv;
    sim.sv += sa * dt;
    sim.sy += sim.sv * dt;

    let moving = Math.abs(sim.target - sim.y) > 0.3 || Math.abs(sim.v) > 2 || Math.abs(sim.sy - 1) > 0.002 || Math.abs(sim.sv) > 0.01;
    sim.drops.forEach((dr) => {
      const da = dr.k * (sim.y - dr.y) - dr.c * dr.v;
      dr.v += da * dt;
      dr.y += dr.v * dt;
      if (Math.abs(sim.y - dr.y) > 0.3 || Math.abs(dr.v) > 2) moving = true;
    });

    paint();
    if (moving) requestAnimationFrame(step);
    else {
      sim.y = sim.target; sim.v = 0; sim.sy = 1; sim.sv = 0;
      sim.drops.forEach((dr) => { dr.y = sim.target; dr.v = 0; });
      paint();
      sim.running = false;
    }
  }

  function kick() {
    if (sim.running) return;
    sim.running = true;
    sim.last = performance.now();
    requestAnimationFrame(step);
  }

  // Little beads that spray off the bubble and dissolve back into it.
  function splash(y, dir) {
    if (reduceMotion) return;
    for (let i = 0; i < 7; i++) {
      const s = 10 + Math.random() * 16;
      const bead = el('span', 'goo__bead');
      const bx = GOO_LEFT + BLOB_W / 2 + (Math.random() - 0.5) * 90;
      const by = y + (dir > 0 ? BLOB_H * 0.85 : BLOB_H * 0.15) + (Math.random() - 0.5) * 30;
      bead.style.width = bead.style.height = `${s}px`;
      bead.style.left = `${bx - s / 2}px`;
      bead.style.top = `${by - s / 2}px`;
      bead.style.setProperty('--dx', `${(Math.random() - 0.5) * 70}px`);
      bead.style.setProperty('--dy', `${dir * (20 + Math.random() * 50)}px`);
      bead.style.setProperty('--dur', `${600 + Math.random() * 500}ms`);
      goo.appendChild(bead);
      bead.addEventListener('animationend', () => bead.remove());
    }
  }

  let activeIndex = -1;
  function select(index, { animate = true } = {}) {
    if (index === activeIndex) return;
    const prev = activeIndex;
    activeIndex = index;
    const btn = cats[index];
    cats.forEach((c, i) => {
      const on = i === index;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
      c.tabIndex = on ? 0 : -1;
    });

    sim.target = blobTargetFor(btn);
    if (!animate || reduceMotion || prev === -1) {
      sim.y = sim.target; sim.v = 0;
      sim.drops.forEach((dr) => { dr.y = sim.target; dr.v = 0; });
      paint();
    } else {
      // A small push in the travel direction gives the bubble a liquid "lunge".
      const dir = Math.sign(sim.target - sim.y) || 1;
      sim.v += dir * 180;
      splash(sim.target, -dir);
      kick();
      btn.classList.remove('is-pop');
      void btn.offsetWidth;
      btn.classList.add('is-pop');
    }

    // Keep the chosen item fully visible if the list scrolls.
    const top = btn.offsetTop - 40;
    const bottom = btn.offsetTop + btn.offsetHeight + 40;
    if (top < list.scrollTop) list.scrollTo({ top, behavior: 'smooth' });
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTo({ top: bottom - list.clientHeight, behavior: 'smooth' });

    const cat = CATEGORIES[index];
    setTitle(cat.title, animate && prev !== -1);
    if (animate && prev !== -1) {
      content.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      renderGrid();
    }
  }

  list.addEventListener('click', (e) => {
    const b = e.target.closest('.cat');
    if (b) select(cats.indexOf(b));
  });
  list.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (activeIndex + (e.key === 'ArrowDown' ? 1 : -1) + cats.length) % cats.length;
    select(next);
    cats[next].focus();
  });

  // Size the goo layer to the whole scrollable list.
  function sizeGoo() { goo.style.height = `${list.scrollHeight}px`; }

  // ---------- Side menu intro: drop → splash → pour → spin-in → drip ----------

  const nav = $('#catnav');
  const liquid = $('#liquid');
  const PILL_X = 290; // pill centre inside the liquid layer
  const PILL_TOP = 200;
  let introTimers = [];

  function liquidBead(size, x, y, frames, opts) {
    const b = el('span', 'liquid-bead');
    b.style.width = b.style.height = `${size}px`;
    b.style.left = `${x - size / 2}px`;
    b.style.top = `${y - size / 2}px`;
    liquid.appendChild(b);
    const anim = b.animate(frames, { fill: 'both', ...opts });
    anim.onfinish = () => b.remove();
  }

  // Droplets thrown up by the impact, pulled back into the pill.
  function impactSplash() {
    for (let i = 0; i < 11; i++) {
      const s = 14 + Math.random() * 30;
      const dx = (Math.random() - 0.5) * 340;
      const dy = -60 - Math.random() * 170;
      liquidBead(s, PILL_X + (Math.random() - 0.5) * 60, PILL_TOP + 30, [
        { transform: 'translate(0, 0) scale(.4)' },
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, offset: 0.45 },
        { transform: `translate(${dx * 0.15}px, ${70 + Math.random() * 90}px) scale(.35)` },
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2, .7, .3, 1)' });
    }
  }

  // Bulges that ride down the sides with the pouring front, so the edges ripple.
  function pourWaves() {
    for (let i = 0; i < 8; i++) {
      const side = i % 2 ? 1 : -1;
      const s = 44 + Math.random() * 26;
      const x = PILL_X + side * (74 + Math.random() * 14);
      liquidBead(s, x, PILL_TOP + 120, [
        { transform: 'translateY(0) scale(.3)' },
        { transform: `translateY(${300 + i * 60}px) scale(1)`, offset: 0.35 },
        { transform: `translateY(${1000 + Math.random() * 300}px) scale(.2)` },
      ], { duration: 760 + Math.random() * 260, delay: i * 45, easing: 'cubic-bezier(.45, 0, .25, 1)' });
    }
  }

  function playIntro() {
    nav.classList.remove('is-pending');
    if (reduceMotion) return;
    introTimers.forEach(clearTimeout);
    introTimers = [];
    const at = (ms, fn) => introTimers.push(setTimeout(fn, ms));

    nav.classList.remove('is-intro', 'is-done');
    void nav.offsetWidth;
    nav.classList.add('is-intro');
    liquid.classList.add('is-gooey');

    // Each item spins in as the pouring front reaches it (pour runs ~720–1430ms).
    cats.forEach((c) => {
      const front = (c.offsetTop + 35 + c.offsetHeight / 2) / 1580;
      c.style.setProperty('--in', `${Math.round(700 + front * 710)}ms`);
    });

    // Park the bubble above the list until the pour is done.
    cats.forEach((c) => c.classList.remove('is-active', 'is-pop'));
    sim.target = sim.y = -340;
    sim.v = 0;
    sim.drops.forEach((dr) => { dr.y = -340; dr.v = 0; });
    paint();

    at(420, impactSplash);
    at(720, pourWaves);
    at(1480, () => {
      sim.target = blobTargetFor(cats[activeIndex]);
      sim.v = 900;
      kick();
    });
    at(1760, () => {
      const c = cats[activeIndex];
      c.classList.add('is-active');
      c.classList.remove('is-pop');
      void c.offsetWidth;
      c.classList.add('is-pop');
      splash(sim.target, -1);
    });
    at(1900, () => nav.classList.add('is-done'));
    at(2300, () => nav.classList.remove('is-intro'));
    at(2400, () => liquid.classList.remove('is-gooey'));
  }

  // ---------- Bottom bar ----------

  const restartIcon = $('.bb-restart__icon');
  $('#restart').addEventListener('click', () => {
    restartIcon.classList.remove('is-spinning');
    void restartIcon.offsetWidth;
    restartIcon.classList.add('is-spinning');
    activeChip = null;
    chipsEl.querySelectorAll('.chip').forEach((c) => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
    const pizza = CATEGORIES.findIndex((c) => c.id === 'pizza');
    if (activeIndex !== pizza) select(pizza, { animate: false });
    setTitle(CATEGORIES[pizza].title, true);
    content.scrollTo({ top: 0, behavior: 'smooth' });
    renderGrid();
    playIntro();
  });

  // ---------- Boot ----------

  renderChips();
  renderGrid();
  sizeGoo();
  select(CATEGORIES.findIndex((c) => c.id === 'pizza'), { animate: false });
  let booted = false;
  function start() {
    if (booted) return;
    booted = true;
    sizeGoo();
    playIntro();
  }
  window.addEventListener('load', start);
  setTimeout(start, 1500);
})();
