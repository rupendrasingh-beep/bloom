// Bloom Dashboard — a tiny static file server.
// Serves everything in ./public, plus POST /api/recommend for the bookshelf's book
// concierge. Run with `npm start` (or `node server.js`).

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { recommend } = require('./lib/recommend');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.join(__dirname, 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

// Images and fonts never change between releases, so browsers may keep them for a year.
const LONG_CACHE = /^\/(assets|assets-masks|fonts)\//;

// Book concierge (the same handler Vercel runs from api/recommend.js)
function recommendRoute(req, res) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 8192) { res.writeHead(413); res.end(); req.destroy(); }
  });
  req.on('end', async () => {
    if (res.writableEnded) return;
    let answers;
    try { answers = JSON.parse(body || '{}'); } catch { res.writeHead(400); return res.end(); }
    const result = await recommend(answers);
    res.writeHead(result ? 200 : 503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(result || { error: 'unavailable' }));
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/recommend') {
    if (req.method === 'POST') return recommendRoute(req, res);
    res.writeHead(405, { Allow: 'POST' });
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  // clean URLs, as on Vercel: /bookshelf serves bookshelf.html
  else if (!path.extname(pathname)) pathname += '.html';

  // Resolve inside ./public only — never serve files outside it.
  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': LONG_CACHE.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Bloom Dashboard running at http://localhost:${PORT}`);
});
