// Rayyan — interactions and motion. Plain JS, no dependencies.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => innerWidth <= 820;

  // Progress of an element through the viewport: 0 when its top meets the
  // bottom of the screen, 1 when its bottom meets the top.
  const viewProgress = (el) => {
    const r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  };

  /* ---------------- Word splitting ---------------- */
  const splitWords = (el, wrapClass) => {
    const out = [];
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            if (wrapClass) {
              w.className = wrapClass;
              w.textContent = part;
            } else {
              w.className = 'word';
              const inner = document.createElement('span');
              inner.textContent = part;
              w.appendChild(inner);
            }
            w.style.setProperty('--w', i++);
            out.push(w);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return out;
  };
  $$('[data-split]').forEach((el) => splitWords(el));
  const quote = $('[data-scrub]');
  const quoteWords = quote ? splitWords(quote, 'sw') : [];

  /* ---------------- Loader ---------------- */
  const loader = $('.loader');
  const loaderFill = $('.loader__logo');
  const loaderCount = $('.loader__count span');
  const critical = ['assets/hero-poster.webp', 'assets/logo.png'];
  let loaded = 0;
  let shown = 0;
  const total = critical.length + 1; // + fonts
  const start = performance.now();
  const minTime = reduced ? 0 : 1300;
  const bump = () => { loaded++; };
  critical.forEach((src) => { const im = new Image(); im.onload = im.onerror = bump; im.src = src; });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
  setTimeout(() => { loaded = total; }, 4000); // never block longer than this

  const tickLoader = () => {
    const t = clamp((performance.now() - start) / Math.max(minTime, 1), 0, 1);
    const target = Math.min(loaded / total, t) * 100;
    shown = lerp(shown, target, reduced ? 1 : 0.12);
    if (target >= 99.9 && shown > 99) shown = 100;
    loaderFill.style.setProperty('--p', shown.toFixed(1) + '%');
    loaderCount.textContent = Math.round(shown);
    if (shown >= 100) {
      setTimeout(() => {
        loader.classList.add('is-done');
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-ready');
      }, reduced ? 0 : 250);
      return;
    }
    requestAnimationFrame(tickLoader);
  };
  requestAnimationFrame(tickLoader);

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      if (e.target.classList.contains('timeline')) countYears(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split], .divider, .source__float, .timeline').forEach((el) => io.observe(el));

  function countYears(root) {
    $$('.tl-year', root).forEach((el, i) => {
      const end = +el.dataset.count;
      const from = end - 24;
      const dur = 1400;
      const t0 = performance.now() + i * 110;
      if (reduced) return;
      const step = (now) => {
        const t = clamp((now - t0) / dur, 0, 1);
        const k = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(from + (end - from) * k);
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = from;
      requestAnimationFrame(step);
    });
  }

  /* ---------------- Header ---------------- */
  const header = $('.header');
  const nav = $('.nav');
  const blob = $('.nav__blob');
  const navLinks = $$('.nav a');
  let lastY = scrollY;

  const moveBlob = (a) => {
    if (!a || isMobile()) return;
    const nr = nav.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    const pad = 16;
    nav.style.setProperty('--x', (r.left - nr.left - pad) + 'px');
    nav.style.setProperty('--w', (r.width + pad * 2) + 'px');
    nav.classList.add('has-blob');
  };
  const activeLink = () => navLinks.find((a) => a.classList.contains('is-active'));
  navLinks.forEach((a) => {
    a.addEventListener('mouseenter', () => moveBlob(a));
    a.addEventListener('focus', () => moveBlob(a));
    a.addEventListener('click', () => document.body.classList.remove('menu-open'));
  });
  nav.addEventListener('mouseleave', () => moveBlob(activeLink()));
  addEventListener('load', () => moveBlob(activeLink()));
  addEventListener('resize', () => moveBlob(activeLink()));
  if (document.fonts) document.fonts.ready.then(() => moveBlob(activeLink()));

  const sectionLinks = navLinks.map((a) => [a, $(a.getAttribute('href'))]).filter(([, s]) => s);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const hit = sectionLinks.find(([, s]) => s === e.target);
      if (!hit) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a === hit[0]));
      if (!nav.matches(':hover')) moveBlob(hit[0]);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sectionLinks.forEach(([, s]) => spy.observe(s));

  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });

  const lang = $('.lang');
  lang.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-lang]');
    if (opt) {
      $$('[data-lang]', lang).forEach((o) => o.setAttribute('aria-selected', o === opt));
      $('.lang__label', lang).textContent = opt.dataset.lang;
    }
    const open = !opt && lang.getAttribute('aria-expanded') !== 'true';
    lang.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => { if (!lang.contains(e.target)) lang.setAttribute('aria-expanded', 'false'); });

  /* ---------------- Cursor ---------------- */
  const cursor = $('.cursor');
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, nx: 0, ny: 0 };
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.nx = e.clientX / innerWidth - 0.5;
    mouse.ny = e.clientY / innerHeight - 0.5;
    if (finePointer) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }, { passive: true });
  if (finePointer) {
    const hoverSel = 'a, button, .tilt, .value, .tl-cell, .size';
    document.addEventListener('pointerover', (e) => cursor.classList.toggle('is-hover', !!e.target.closest(hoverSel)));
    addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    document.addEventListener('pointerleave', () => { cursor.style.opacity = 0; });
    document.addEventListener('pointerenter', () => { cursor.style.opacity = 1; });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      el.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1), background .3s, box-shadow .3s';
    });
  }

  /* ---------------- Tilt cards ---------------- */
  const tilt = (el, target, max) => {
    if (!finePointer || reduced) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
      target.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
      target.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      target.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => {
      target.style.setProperty('--rx', '0deg');
      target.style.setProperty('--ry', '0deg');
    });
  };
  const founder = $('.founder');
  tilt(founder, founder, 14);
  const product = $('.product');
  const productTilt = $('.product__tilt');
  tilt(product, productTilt, 5);

  /* Timeline: a glow follows the pointer inside each cell */
  $$('.tl-cell').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------------- Click ripples (water rings) ---------------- */
  const rc = $('.ripples');
  const rctx = rc.getContext('2d');
  const rings = [];
  let dpr = Math.min(devicePixelRatio || 1, 2);
  const sizeRipples = () => { rc.width = innerWidth * dpr; rc.height = innerHeight * dpr; };
  sizeRipples();
  addEventListener('resize', sizeRipples);
  addEventListener('pointerdown', (e) => {
    if (reduced) return;
    for (let k = 0; k < 3; k++) rings.push({ x: e.clientX, y: e.clientY, r: 2, life: 1, delay: k * 7, speed: 2.6 - k * 0.45 });
  });
  let ripplesDirty = false;
  const drawRipples = () => {
    if (!rings.length && !ripplesDirty) return;
    ripplesDirty = rings.length > 0;
    rctx.clearRect(0, 0, rc.width, rc.height);
    for (let i = rings.length - 1; i >= 0; i--) {
      const g = rings[i];
      if (g.delay > 0) { g.delay--; continue; }
      g.r += g.speed * (1 + g.r * 0.012);
      g.life -= 0.016;
      if (g.life <= 0) { rings.splice(i, 1); continue; }
      rctx.beginPath();
      rctx.ellipse(g.x * dpr, g.y * dpr, g.r * dpr, g.r * 0.92 * dpr, 0, 0, Math.PI * 2);
      rctx.strokeStyle = `rgba(160, 245, 242, ${g.life * 0.55})`;
      rctx.lineWidth = 1.4 * dpr * g.life + 0.3;
      rctx.stroke();
    }
  };

  /* ---------------- Hero bubbles ---------------- */
  const hero = $('.hero');
  const hc = $('.hero__bubbles');
  const hctx = hc.getContext('2d');
  let heroVisible = true;
  let bubbles = [];
  const makeBubble = (initial) => {
    const depth = Math.random();
    return {
      x: Math.random() * hc.width,
      y: initial ? Math.random() * hc.height : hc.height + 20 * dpr,
      r: (0.6 + depth * depth * 4.2) * dpr,
      vy: (0.25 + depth * 1.1) * dpr,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.02,
      a: 0.15 + depth * 0.55,
      streak: Math.random() < 0.18,
      depth,
    };
  };
  const sizeHero = () => {
    hc.width = hero.clientWidth * dpr;
    hc.height = hero.clientHeight * dpr;
    const n = Math.round((hero.clientWidth * hero.clientHeight) / 9000);
    bubbles = Array.from({ length: clamp(n, 40, 220) }, () => makeBubble(true));
  };
  sizeHero();
  addEventListener('resize', sizeHero);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

  const drawHero = () => {
    hctx.clearRect(0, 0, hc.width, hc.height);
    const hr = hero.getBoundingClientRect();
    const mx = (mouse.x - hr.left) * dpr;
    const my = (mouse.y - hr.top) * dpr;
    for (const b of bubbles) {
      b.sway += b.swaySpeed;
      b.y -= b.vy;
      b.x += Math.sin(b.sway) * 0.35 * dpr;
      // Bubbles drift away from the pointer
      const dx = b.x - mx, dy = b.y - my;
      const d2 = dx * dx + dy * dy;
      const rad = 140 * dpr;
      if (d2 < rad * rad) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / rad) * 3 * (0.4 + b.depth);
        b.x += (dx / d) * f; b.y += (dy / d) * f;
      }
      if (b.y < -30 * dpr) Object.assign(b, makeBubble(false));
      const px = b.x + mouse.nx * -30 * b.depth * dpr;
      if (b.streak) {
        hctx.strokeStyle = `rgba(200, 245, 255, ${b.a})`;
        hctx.lineWidth = Math.max(1, b.r * 0.45);
        hctx.lineCap = 'round';
        hctx.beginPath();
        hctx.moveTo(px, b.y);
        hctx.lineTo(px + 2 * dpr, b.y + b.r * 5);
        hctx.stroke();
      } else {
        const g = hctx.createRadialGradient(px - b.r * 0.35, b.y - b.r * 0.35, 0, px, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,${b.a})`);
        g.addColorStop(0.55, `rgba(170,225,255,${b.a * 0.35})`);
        g.addColorStop(1, `rgba(170,225,255,${b.a * 0.75})`);
        hctx.fillStyle = g;
        hctx.beginPath();
        hctx.arc(px, b.y, b.r, 0, Math.PI * 2);
        hctx.fill();
      }
    }
  };

  /* ---------------- Product fizz (bubbles inside the gold ring) ---------------- */
  const fc = $('.product__fizz');
  const fctx = fc.getContext('2d');
  let fizz = [];
  let productVisible = false;
  const sizeFizz = () => { fc.width = fc.clientWidth * dpr; fc.height = fc.clientHeight * dpr; };
  sizeFizz();
  addEventListener('resize', sizeFizz);
  new IntersectionObserver(([e]) => { productVisible = e.isIntersecting; }).observe(fc);
  // Ring geometry in the 295×356 ring box: circle centre (147.5, 208.5), r ≈ 140.
  const ringCircle = () => ({ cx: fc.width * 0.5, cy: fc.height * (208.5 / 356), r: fc.width * (138 / 295) });
  const spawnFizz = (burst) => {
    const { cx, cy, r } = ringCircle();
    const ang = Math.random() * Math.PI;
    const rr = Math.random() * r * 0.9;
    fizz.push({
      x: cx + Math.cos(ang) * rr * (Math.random() < 0.5 ? -1 : 1),
      y: cy + Math.sin(ang) * rr * 0.9,
      r: (0.6 + Math.random() * (burst ? 2.6 : 1.8)) * dpr * (fc.width / (295 * dpr)),
      vy: (0.35 + Math.random() * (burst ? 2.2 : 0.9)) * dpr,
      sway: Math.random() * 6,
      life: 1,
    });
  };
  const drawFizz = () => {
    fctx.clearRect(0, 0, fc.width, fc.height);
    const { cx, cy, r } = ringCircle();
    if (fizz.length < 70 && Math.random() < 0.6) spawnFizz(false);
    fctx.save();
    fctx.beginPath();
    fctx.arc(cx, cy, r, 0, Math.PI * 2);
    fctx.rect(cx - r * 0.42, 0, r * 0.84, cy);
    fctx.clip();
    for (let i = fizz.length - 1; i >= 0; i--) {
      const b = fizz[i];
      b.y -= b.vy; b.sway += 0.08; b.x += Math.sin(b.sway) * 0.25 * dpr;
      if (b.y < cy - r * 1.4) b.life -= 0.04;
      if (b.y < 0 || b.life <= 0) { fizz.splice(i, 1); continue; }
      fctx.beginPath();
      fctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      fctx.strokeStyle = `rgba(230, 255, 220, ${0.55 * b.life})`;
      fctx.lineWidth = Math.max(0.6, b.r * 0.35);
      fctx.stroke();
      fctx.fillStyle = `rgba(255, 255, 240, ${0.12 * b.life})`;
      fctx.fill();
    }
    fctx.restore();
  };

  /* ---------------- Product slider + sizes ---------------- */
  const names = $$('.product__name');
  let nameIdx = 0;
  let sliding = false;
  const slideTo = (dir) => {
    if (sliding) return;
    sliding = true;
    const cur = names[nameIdx];
    nameIdx = (nameIdx + names.length + dir) % names.length;
    const next = names[nameIdx];
    // Incoming title enters from the side we are moving towards
    next.classList.remove('is-out', 'from-left');
    if (dir < 0) next.classList.add('from-left');
    next.getBoundingClientRect();
    next.classList.remove('from-left');
    cur.classList.remove('is-current');
    if (dir > 0) cur.classList.add('is-out');
    next.classList.add('is-current');
    cur.setAttribute('aria-hidden', 'true');
    next.removeAttribute('aria-hidden');
    for (let k = 0; k < 40; k++) spawnFizz(true);
    setTimeout(() => { cur.classList.remove('is-out'); sliding = false; }, 900);
  };
  $('.product__arrow--prev').addEventListener('click', () => slideTo(-1));
  $('.product__arrow--next').addEventListener('click', () => slideTo(1));

  const sizes = $$('.size');
  let sizeIdx = 0;
  let sizeTimer;
  const setSize = (i) => {
    sizeIdx = i;
    sizes.forEach((s, k) => s.classList.toggle('is-active', k === i));
  };
  sizes.forEach((s, i) => {
    s.addEventListener('mouseenter', () => setSize(i));
    s.addEventListener('click', () => { setSize(i); for (let k = 0; k < 25; k++) spawnFizz(true); });
  });
  const autoSizes = () => {
    clearInterval(sizeTimer);
    if (reduced) return;
    sizeTimer = setInterval(() => {
      if (productVisible && !product.matches(':hover')) setSize((sizeIdx + 1) % sizes.length);
    }, 2800);
  };
  autoSizes();

  /* ---------------- Marquee ---------------- */
  const track = $('.marquee__track');
  const baseHTML = track.innerHTML;
  const fillTrack = () => {
    track.innerHTML = baseHTML;
    const unit = track.scrollWidth;
    const copies = Math.ceil((innerWidth * 2) / unit) + 1;
    track.innerHTML = baseHTML.repeat(copies);
    return unit;
  };
  let marqueeUnit = fillTrack();
  addEventListener('resize', () => { marqueeUnit = fillTrack(); });
  const marquee = $('.marquee');
  let marqueeX = 0;
  let velocity = 0;

  /* ---------------- Scroll-linked effects ---------------- */
  const progressBar = $('.scroll-progress');
  const heroMedia = $('.hero__media');
  const storyImg = $('.story__visual img');
  const storySec = $('.story');
  const sourceSec = $('.source');
  const sourceFloat = $('.source__float');
  const sourceScene = $('.source__scene');

  const onScroll = () => {
    const y = scrollY;
    const dy = y - lastY;
    velocity = clamp(velocity + Math.abs(dy) * 0.04, 0, 6);

    header.classList.toggle('is-scrolled', y > 40);
    const hideAfter = hero.offsetHeight * 0.6;
    if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > hideAfter && dy > 2);
    if (dy < -2) header.classList.remove('is-hidden');
    lastY = y;

    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (reduced) return;

    if (y < hero.offsetHeight) heroMedia.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;

    const sp = viewProgress(storySec);
    const k = clamp((sp - 0.1) / 0.45, 0, 1);
    const e = 1 - Math.pow(1 - k, 3);
    storyImg.style.setProperty('--rise', ((1 - e) * 160).toFixed(1) + 'px');
    storyImg.style.setProperty('--sc', (0.94 + e * 0.06).toFixed(4));

    if (!isMobile()) {
      const p = viewProgress(sourceSec);
      const t = clamp((p - 0.05) / 0.45, 0, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      sourceFloat.style.setProperty('--s', (0.84 + ease * 0.16).toFixed(4));
      sourceFloat.style.setProperty('--r', ((1 - ease) * -5).toFixed(2) + 'deg');
    }

    if (quoteWords.length) {
      const r = quote.getBoundingClientRect();
      const q = clamp((innerHeight * 0.88 - r.top) / (innerHeight * 0.5), 0, 1);
      const lit = Math.round(q * quoteWords.length);
      quoteWords.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mouse parallax on the island */
  if (finePointer && !reduced) {
    sourceSec.addEventListener('pointermove', () => {
      sourceScene.style.setProperty('--px', (mouse.nx * -26).toFixed(1) + 'px');
      sourceScene.style.setProperty('--py', (mouse.ny * -18).toFixed(1) + 'px');
    });
    sourceSec.addEventListener('pointerleave', () => {
      sourceScene.style.setProperty('--px', '0px');
      sourceScene.style.setProperty('--py', '0px');
    });
  }

  /* ---------------- Main loop ---------------- */
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(now - last, 50);
    last = now;

    if (finePointer) {
      mouse.rx = lerp(mouse.rx, mouse.x, 0.18);
      mouse.ry = lerp(mouse.ry, mouse.y, 0.18);
      ring.style.transform = `translate3d(${mouse.rx}px, ${mouse.ry}px, 0)`;
    }

    if (!reduced) {
      if (heroVisible) {
        drawHero();
        heroMedia.firstElementChild.style.translate = `${(mouse.nx * -18).toFixed(2)}px ${(mouse.ny * -12).toFixed(2)}px`;
      }
      if (productVisible) drawFizz();
      drawRipples();

      velocity = lerp(velocity, 0, 0.05);
      marqueeX -= (0.6 + velocity) * (dt / 16.67) * (marquee.matches(':hover') ? 0.25 : 1);
      if (-marqueeX >= marqueeUnit) marqueeX += marqueeUnit;
      track.style.transform = `translate3d(${marqueeX.toFixed(2)}px, 0, 0)`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
