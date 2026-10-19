// Renders frames of index.html by calling seek(t) in headless Chromium.
//   node render.mjs stills <outDir> t1 t2 ...   -> one PNG per time
//   node render.mjs frames <outDir> [from] [to] -> every frame at 60 fps (frame indices, `to` exclusive)
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const here = path.dirname(fileURLToPath(import.meta.url));
const [mode = 'stills', outDir = path.join(here, 'out'), ...rest] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'index.html')).href + '?render');
await page.evaluate(() => window.FILM.ready);
const canvas = page.locator('#c');

async function shot(t, file) {
  await page.evaluate(t => window.FILM.seek(t), t);
  await canvas.screenshot({ path: file });
}

if (mode === 'stills') {
  for (const s of rest) await shot(Number(s), path.join(outDir, `t${Number(s).toFixed(2)}.png`));
} else if (mode === 'frames') {
  const fps = await page.evaluate(() => window.FILM.FPS);
  const dur = await page.evaluate(() => window.FILM.DUR);
  const from = Number(rest[0] ?? 0), to = Number(rest[1] ?? fps * dur);
  for (let f = from; f < to; f++) await shot(f / fps, path.join(outDir, `f${String(f).padStart(4, '0')}.png`));
} else if (mode === 'cues') {
  const cues = await page.evaluate(() => window.FILM.cues());
  fs.writeFileSync(path.join(outDir, 'cues.json'), JSON.stringify(cues, null, 1));
}
await browser.close();
