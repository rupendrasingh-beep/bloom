// Rayyan landing page — interactions and motion.
// Plain JS, no dependencies. Everything degrades to a static page without it.
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Split headings into words for the staggered rise ---------- */
  $$('[data-split]').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const word = document.createElement('span');
            word.className = 'word';
            const inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            word.append(inner);
            frag.append(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrap(child);
        }
      });
    };
    wrap(el);
  });

  /* ---------- Reveal on scroll ---------- */
  const groups = new Map();
  $$('[data-reveal], [data-split]').forEach((el) => {
    // stagger siblings that share a parent (cards, pins, …)
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    groups.set(parent, n + 1);
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(n, 8) * 0.09}s`);
  });
  $$('.source__art [data-reveal="pin"]').forEach((el, i) => el.style.setProperty('--d', `${0.9 + i * 0.12}s`));

  // Checked against the scroll position (not IntersectionObserver) so a fast
  // jump past an element still reveals it.
  const onReveal = new Map();
  let pending = $$('[data-reveal], [data-split]');
  const checkReveals = () => {
    if (!pending.length) return;
    const line = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > line) return true;
      el.classList.add('is-in');
      const cb = onReveal.get(el);
      if (cb) cb();
      return false;
    });
  };

  /* ---------- Year count-up on the timeline ---------- */
  const timeline = $('.timeline');
  if (timeline) {
    onReveal.set(timeline, () => {
      $$('[data-count]', timeline).forEach((el, i) => {
        const to = Number(el.dataset.count);
        if (reduceMotion) return;
        const from = to - 60;
        const start = performance.now() + 250 + i * 120;
        const dur = 1400;
        const tick = (now) => {
          const t = clamp((now - start) / dur, 0, 1);
          const e = 1 - Math.pow(1 - t, 4);
          el.textContent = Math.round(from + (to - from) * e);
          if (t < 1) requestAnimationFrame(tick);
        };
        el.textContent = from;
        requestAnimationFrame(tick);
      });
    });
  }

  /* ---------- Header: hide on scroll down, show on scroll up ---------- */
  const header = $('[data-header]');
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (y < window.innerHeight * 0.5 && links[0] && !links[0].classList.contains('is-active')) {
      links.forEach((l, i) => l.classList.toggle('is-active', i === 0));
      moveGlow(links[0]);
    }
    const menuOpen = header.classList.contains('menu-open');
    if (!menuOpen) header.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.6);
    lastY = y;
  };

  // mobile menu
  const toggle = $('[data-menu-toggle]');
  toggle.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.nav__list a').forEach((a) => a.addEventListener('click', () => {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // light that slides under the hovered / current nav link
  const nav = $('.nav');
  const glow = $('.nav__glow');
  const links = $$('.nav__list a');
  const moveGlow = (a) => {
    if (!a) { glow.style.opacity = 0; return; }
    const nr = nav.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    glow.style.opacity = 1;
    glow.style.width = `${r.width + 36}px`;
    glow.style.transform = `translateX(${r.left - nr.left - 18}px)`;
  };
  const activeLink = () => links.find((a) => a.classList.contains('is-active'));
  links.forEach((a) => a.addEventListener('pointerenter', () => moveGlow(a)));
  nav.addEventListener('pointerleave', () => moveGlow(activeLink()));
  requestAnimationFrame(() => moveGlow(activeLink()));
  window.addEventListener('resize', () => moveGlow(activeLink()));

  // scroll spy
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = links.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      links.forEach((a) => a.classList.toggle('is-active', a === link));
      moveGlow(link);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => {
    const target = $(a.getAttribute('href'));
    if (target) spy.observe(target);
  });

  /* ---------- Hero: intro video, with rising bubbles behind it ---------- */
  const hero = $('.hero');
  const video = $('[data-hero-video]');
  if (video) {
    const ready = () => hero.classList.add('has-video');
    if (video.readyState >= 2) ready();
    video.addEventListener('loadeddata', ready);
    if (reduceMotion) video.removeAttribute('autoplay'), video.pause();
  }

  const bubbles = $('[data-bubbles]');
  if (bubbles && !reduceMotion) {
    const ctx = bubbles.getContext('2d');
    let w = 0, h = 0, dpr = 1, items = [];
    const make = (anywhere) => {
      const r = Math.random() ** 2 * 7 + 1;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + r * 4,
        r,
        vy: 0.25 + r * 0.12 + Math.random() * 0.3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.02,
        a: 0.15 + Math.random() * 0.45,
      };
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = bubbles.clientWidth; h = bubbles.clientHeight;
      bubbles.width = w * dpr; bubbles.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      items = Array.from({ length: count }, () => make(true));
    };
    let mouse = { x: -999, y: -999 };
    hero.addEventListener('pointermove', (e) => {
      const r = bubbles.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    hero.addEventListener('pointerleave', () => { mouse = { x: -999, y: -999 }; });
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible || document.hidden || hero.classList.contains('has-video')) return;
      ctx.clearRect(0, 0, w, h);
      items.forEach((b, i) => {
        b.sway += b.swaySpeed;
        b.y -= b.vy;
        b.x += Math.sin(b.sway) * 0.35;
        // bubbles drift away from the pointer
        const dx = b.x - mouse.x, dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) { const f = (14000 - d2) / 14000; b.x += (dx / Math.sqrt(d2 + 1)) * f * 3; b.y += (dy / Math.sqrt(d2 + 1)) * f * 1.5; }
        if (b.y < -20) items[i] = make(false);
        const g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,${b.a})`);
        g.addColorStop(0.6, `rgba(190,225,255,${b.a * 0.25})`);
        g.addColorStop(1, `rgba(255,255,255,${b.a * 0.7})`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
    };
    size();
    window.addEventListener('resize', size);
    draw();
  }

  /* ---------- Water ripple behind the folds (Bg_Ripple) ---------- */
  const rippleCanvas = $('[data-ripple]');
  if (rippleCanvas && !reduceMotion) {
    const ctx = rippleCanvas.getContext('2d');
    const CELL = 6;
    let cols = 0, rows = 0, cur, prev, img, buf;
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    const size = () => {
      const w = rippleCanvas.clientWidth, h = rippleCanvas.clientHeight;
      rippleCanvas.width = w; rippleCanvas.height = h;
      cols = Math.ceil(w / CELL) + 2; rows = Math.ceil(h / CELL) + 2;
      cur = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
      off.width = cols; off.height = rows;
      img = offCtx.createImageData(cols, rows);
      buf = img.data;
      ctx.imageSmoothingEnabled = true;
    };
    const drop = (x, y, radius, strength) => {
      const cx = Math.round(x / CELL) + 1, cy = Math.round(y / CELL) + 1;
      for (let j = -radius; j <= radius; j++) {
        for (let i = -radius; i <= radius; i++) {
          const xx = cx + i, yy = cy + j;
          if (xx < 1 || yy < 1 || xx >= cols - 1 || yy >= rows - 1) continue;
          const d = Math.sqrt(i * i + j * j);
          if (d <= radius) prev[yy * cols + xx] += strength * (1 - d / radius);
        }
      }
    };
    let last = null;
    window.addEventListener('pointermove', (e) => {
      const r = rippleCanvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        if (dist > 6) drop(x, y, 3, Math.min(dist, 40) * 1.4);
      }
      last = { x, y };
    }, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      const r = rippleCanvas.getBoundingClientRect();
      drop(e.clientX - r.left, e.clientY - r.top, 5, 220);
    }, { passive: true });

    let active = false;
    const track = rippleCanvas.parentElement;
    new IntersectionObserver(([e]) => { active = e.isIntersecting; }).observe(track);
    let rain = 0;
    const step = () => {
      requestAnimationFrame(step);
      if (!active || document.hidden) return;
      if (++rain % 70 === 0) drop(Math.random() * rippleCanvas.width, Math.random() * rippleCanvas.height, 3, 90);
      const damp = 0.965;
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;
          cur[i] = ((prev[i - 1] + prev[i + 1] + prev[i - cols] + prev[i + cols]) * 0.5 - cur[i]) * damp;
        }
      }
      // light the slopes of the waves: bright teal-white crests on transparent water
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;
          const slope = (cur[i - 1] - cur[i + 1]) + (cur[i - cols] - cur[i + cols]);
          const a = clamp(Math.abs(slope) * 2.2, 0, 140);
          const p = i * 4;
          buf[p] = 150; buf[p + 1] = 235; buf[p + 2] = 255; buf[p + 3] = a;
        }
      }
      offCtx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
      ctx.drawImage(off, 1, 1, cols - 2, rows - 2, 0, 0, (cols - 2) * CELL, (rows - 2) * CELL);
      const t = cur; cur = prev; prev = t;
    };
    size();
    window.addEventListener('resize', size);
    step();
  }

  /* ---------- Parallax + hero zoom (one rAF per scroll) ---------- */
  const parallax = $$('[data-parallax]');
  const heroMedia = $('[data-hero-media]');
  const onScrollMotion = () => {
    const vh = window.innerHeight;
    if (!reduceMotion) {
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const centre = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${centre * Number(el.dataset.parallax)}px, 0)`;
      });
      if (heroMedia) {
        const p = clamp(window.scrollY / vh, 0, 1);
        heroMedia.style.transform = `scale(${1 + p * 0.12}) translateY(${p * 12}%)`;
        heroMedia.style.opacity = String(1 - p * 0.6);
      }
    }
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollHeader(); onScrollMotion(); checkReveals(); ticking = false; });
  }, { passive: true });
  onScrollHeader();
  onScrollMotion();
  // first check after layout settles (fonts, the count-up callback registered below)
  window.addEventListener('load', checkReveals);
  window.addEventListener('resize', checkReveals);
  setTimeout(checkReveals, 60);

  /* ---------- Tilt + pointer spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach((el) => {
      let raf = 0;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--mx', `${px * 100}%`);
          el.style.setProperty('--my', `${py * 100}%`);
          el.style.transition = 'transform .15s ease-out, box-shadow .5s';
          el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 10}deg) translateY(-4px)`;
        });
      });
      el.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), box-shadow .5s';
        el.style.transform = '';
      });
    });
  }
  $$('.timeline__cell').forEach((cell) => {
    cell.addEventListener('pointermove', (e) => {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Bottling showcase ---------- */
  const show = $('[data-showcase]');
  if (show) {
    const slides = ['sparkling', 'still'];
    const heroBottle = (slide) => $(`.showcase__hero img[data-for="${slide}"]`, show);
    const go = (dir) => {
      const now = show.dataset.slide;
      const next = slides[(slides.indexOf(now) + dir + slides.length) % slides.length];
      show.dataset.slide = next;
    };
    $$('.arrow', show).forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir))));
    show.tabIndex = 0;
    show.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    let sx = null;
    show.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    show.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });

    // picking a size swaps the big bottle
    $$('.sizes', show).forEach((list) => {
      const slide = list.dataset.for;
      $$('.size', list).forEach((btn) => btn.addEventListener('click', () => {
        if (btn.classList.contains('is-active')) return;
        $$('.size', list).forEach((b) => b.classList.toggle('is-active', b === btn));
        const img = heroBottle(slide);
        img.classList.add('is-swapping');
        setTimeout(() => {
          img.src = btn.dataset.bottle;
          const done = () => requestAnimationFrame(() => img.classList.remove('is-swapping'));
          if (img.complete) done(); else img.addEventListener('load', done, { once: true });
        }, reduceMotion ? 0 : 380);
      }));
    });
  }

  /* ---------- Footer ticker: repeat the set until it fills two widths ---------- */
  const ticker = $('[data-ticker]');
  if (ticker) {
    const set = $('.ticker__set', ticker);
    const fill = () => {
      $$('.ticker__set', ticker).slice(1).forEach((n) => n.remove());
      const need = Math.ceil((window.innerWidth * 2) / set.offsetWidth) + 1;
      for (let i = 1; i < need; i++) {
        const clone = set.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        ticker.append(clone);
      }
      ticker.style.setProperty('--marquee-shift', `-${set.offsetWidth}px`);
      ticker.style.setProperty('--marquee-time', `${set.offsetWidth / 60}s`);
    };
    fill();
    window.addEventListener('resize', fill);
    if (document.fonts) document.fonts.ready.then(fill);
  }
})();
