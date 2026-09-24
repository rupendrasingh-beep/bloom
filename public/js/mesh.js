/*
 * Mesh gradient renderer.
 * WebGL2 port of Figma's "Mesh gradient" shader fill (4x4 Catmull-Rom colour mesh,
 * interpolated in linear light and resolved back to sRGB) so it runs in every
 * browser without WebGPU.
 */
(function () {
  const VS = `#version 300 es
  in vec2 aPos; in vec4 aColor; out vec4 vColor;
  void main() { vColor = aColor; gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0); }`;
  const FS = `#version 300 es
  precision highp float; in vec4 vColor; out vec4 outColor;
  float toSrgb(float v) { v = max(v, 0.0); return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055; }
  void main() { outColor = vec4(clamp(vec3(toSrgb(vColor.r), toSrgb(vColor.g), toSrgb(vColor.b)), 0.0, 1.0), 1.0) * vColor.a; }`;

  const catmull = (a, b, c, d, t) => {
    const t2 = t * t, t3 = t2 * t;
    return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  };
  const toLinear = (v) => { v = Math.min(Math.max(v, 0), 1); return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const segment = (v) => { const s = Math.min(Math.max(v, 0), 1) * 3; const i = Math.min(Math.floor(s), 2); return [i, s - i]; };

  // Evaluate the 4x4 mesh at parameter (u, v); `pts[row][col]` holds arrays of channels.
  function evalMesh(pts, u, v) {
    const [ix, fx] = segment(u), [iy, fy] = segment(v);
    const xs = [Math.max(ix - 1, 0), ix, ix + 1, Math.min(ix + 2, 3)];
    const ys = [Math.max(iy - 1, 0), iy, iy + 1, Math.min(iy + 2, 3)];
    const n = pts[0][0].length, out = new Array(n);
    for (let k = 0; k < n; k++) {
      const rows = ys.map((y) => catmull(pts[y][xs[0]][k], pts[y][xs[1]][k], pts[y][xs[2]][k], pts[y][xs[3]][k], fx));
      out[k] = catmull(rows[0], rows[1], rows[2], rows[3], fy);
    }
    return out;
  }

  function buildMesh(params) {
    const pos = [], col = [];
    for (let r = 0; r < 4; r++) {
      pos.push([]); col.push([]);
      for (let c = 0; c < 4; c++) {
        const p = params[`p${c}${r}`];
        pos[r].push([p.x / 100, p.y / 100]);
        col[r].push([toLinear(p.color.r), toLinear(p.color.g), toLinear(p.color.b), Math.min(Math.max(p.color.a, 0), 1)]);
      }
    }
    const n = Math.max(8, Math.min(256, params.tessellation || 128));
    const verts = [];
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        const u = i / n, v = j / n;
        const p = evalMesh(pos, u, v);
        const c = evalMesh(col, u, v).map((x) => Math.min(Math.max(x, 0), 1));
        verts.push(p[0], p[1], c[0], c[1], c[2], c[3]);
      }
    }
    const idx = [];
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    return { verts: new Float32Array(verts), idx: new Uint32Array(idx) };
  }

  // GL state is created once per canvas and reused, so the hover animation can
  // redraw every frame without recompiling or reallocating.
  function setup(canvas) {
    if (canvas._mesh) return canvas._mesh;
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: true });
    if (!gl) return (canvas._mesh = { gl: null });
    const prog = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]].forEach(([type, src]) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); gl.attachShader(prog, s);
    });
    gl.linkProgram(prog); gl.useProgram(prog);
    const vbo = gl.createBuffer(), ibo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    const aPos = gl.getAttribLocation(prog, 'aPos'), aColor = gl.getAttribLocation(prog, 'aColor');
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(aColor); gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 24, 8);
    return (canvas._mesh = { gl, count: 0, n: 0 });
  }

  function render(canvas, params = JSON.parse(canvas.dataset.mesh)) {
    // smooth gradients gain nothing from retina resolution on very large surfaces
    const big = canvas.offsetWidth * canvas.offsetHeight > 1e6;
    const dpr = big ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.offsetWidth * dpr));
    const h = Math.max(1, Math.round(canvas.offsetHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const state = setup(canvas);
    const gl = state.gl;
    if (!gl) return fallback(canvas, params);
    const { verts, idx } = buildMesh(params);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
    if (state.count !== idx.length) { gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW); state.count = idx.length; }
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
  }

  /* ---------- Hover flow: the gradient's colours travel round the shape ---------- */
  // The 12 border points in clockwise order, and the 4 interior points.
  const RING = ['p00', 'p10', 'p20', 'p30', 'p31', 'p32', 'p33', 'p23', 'p13', 'p03', 'p02', 'p01'];
  const CORE = ['p11', 'p21', 'p22', 'p12'];
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpColor = (a, b, t) => ({ r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t), a: lerp(a.a, b.a, t) });

  // Samples a closed loop of colours at a fractional index.
  function around(keys, base, at) {
    const n = keys.length, i = ((Math.floor(at) % n) + n) % n, f = at - Math.floor(at);
    return lerpColor(base[keys[i]].color, base[keys[(i + 1) % n]].color, f);
  }

  // `k` (0-1) is how far the shape has blended into the animated state; `pull`
  // (0-1) is how strongly the interior leans toward `pointer` (mesh % units).
  function flowParams(base, t, k, opt = {}) {
    const { speed = 1, tess = 40, pointer = null, pull = 0, amp = 14, reach = 22 } = opt;
    const out = JSON.parse(JSON.stringify(base));
    RING.forEach((key, i) => { out[key].color = lerpColor(base[key].color, around(RING, base, i + t * 1.1 * speed), k); });
    CORE.forEach((key, i) => {
      out[key].color = lerpColor(base[key].color, around(CORE, base, i + t * 0.8 * speed), k);
      // interior points orbit, so the colour boundaries swirl rather than slide
      const phase = i * Math.PI / 2;
      let x = base[key].x + Math.sin(t * 1.7 * speed + phase) * amp * k;
      let y = base[key].y + Math.cos(t * 1.3 * speed + phase) * amp * k;
      if (pointer && pull > 0) {
        // lean the colour field toward the cursor, capped so the mesh never folds
        x += Math.max(-reach, Math.min(reach, (pointer.x - base[key].x) * 0.45)) * pull;
        y += Math.max(-reach, Math.min(reach, (pointer.y - base[key].y) * 0.45)) * pull;
      }
      out[key].x = x; out[key].y = y;
    });
    out.tessellation = tess;
    return out;
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = (from, to, dt, tau) => from + (to - from) * (1 - Math.exp(-dt / tau));

  function flowState(canvas) {
    return canvas._flow || (canvas._flow = {
      k: 0, t: 0, on: false, raf: 0, last: 0, idle: 0, speed: 1, tess: 40, amp: 14, reach: 22, visible: true,
      pull: 0, hover: false, pointer: { x: 50, y: 50 }, aim: { x: 50, y: 50 },
      base: JSON.parse(canvas.dataset.mesh),
    });
  }

  function run(canvas) {
    const st = flowState(canvas);
    if (st.raf || reduced) return;
    st.last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - st.last) / 1000);
      st.last = now;
      st.t += dt;
      const target = st.on ? 1 : st.idle;
      // ease in quickly, settle back more slowly
      st.k = ease(st.k, target, dt, target > st.k ? 0.25 : 0.45);
      st.pull = ease(st.pull, st.hover ? 1 : 0, dt, 0.35);
      st.pointer.x = ease(st.pointer.x, st.aim.x, dt, 0.18);
      st.pointer.y = ease(st.pointer.y, st.aim.y, dt, 0.18);
      const resting = !st.on && st.idle === 0 && st.k < 0.002 && st.pull < 0.002;
      const asleep = !st.visible || document.hidden;
      if (resting || asleep) {
        st.raf = 0;
        if (resting) { st.k = 0; st.pull = 0; render(canvas, st.base); }
        return;
      }
      render(canvas, flowParams(st.base, st.t, st.k, { speed: st.speed, tess: st.tess, amp: st.amp, reach: st.reach, pointer: st.pointer, pull: st.pull }));
      st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);
  }

  function setFlow(canvas, on) {
    flowState(canvas).on = on;
    run(canvas);
  }

  // A gradient that never rests: drifts at `idle` strength, runs at full strength and
  // follows the cursor while `hoverEl` is hovered, and sleeps while off screen.
  function ambient(canvas, hoverEl, { idle = 0.6, speed = 0.35, tess = 56, amp = 7, reach = 10 } = {}) {
    if (reduced) return;
    const st = flowState(canvas);
    Object.assign(st, { idle, speed, tess, amp, reach });
    hoverEl.addEventListener('pointerenter', () => { st.hover = true; st.on = true; run(canvas); });
    hoverEl.addEventListener('pointerleave', () => { st.hover = false; st.on = false; st.aim.x = 50; st.aim.y = 50; });
    hoverEl.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      st.aim.x = ((e.clientX - r.left) / r.width) * 100;
      st.aim.y = ((e.clientY - r.top) / r.height) * 100;
    });
    // `visible` is on-screen only; the tab's own visibility is read live each frame
    new IntersectionObserver(([entry]) => {
      st.visible = entry.isIntersecting;
      if (st.visible) run(canvas);
    }).observe(hoverEl);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) run(canvas); });
    run(canvas);
  }

  // Canvas2D fallback: sample the colour mesh per pixel on a small grid and upscale.
  function fallback(canvas, params) {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const S = 64, img = ctx.createImageData(S, S), col = [];
    for (let r = 0; r < 4; r++) { col.push([]); for (let c = 0; c < 4; c++) { const p = params[`p${c}${r}`]; col[r].push([toLinear(p.color.r), toLinear(p.color.g), toLinear(p.color.b)]); } }
    const srgb = (v) => { v = Math.max(v, 0); return 255 * Math.min(1, v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const c = evalMesh(col, x / (S - 1), y / (S - 1)), o = (y * S + x) * 4;
      img.data[o] = srgb(c[0]); img.data[o + 1] = srgb(c[1]); img.data[o + 2] = srgb(c[2]); img.data[o + 3] = 255;
    }
    const tmp = document.createElement('canvas'); tmp.width = tmp.height = S; tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingQuality = 'high'; ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
  }

  window.renderMeshes = () => document.querySelectorAll('canvas.mesh').forEach((c) => render(c));
  window.setMeshFlow = setFlow;
  // swap a canvas's colour mesh (e.g. for the dark theme) and redraw it now
  window.setMeshParams = (canvas, params) => { canvas.dataset.mesh = JSON.stringify(params); render(canvas, params); };
  window.meshAmbient = ambient;
})();
