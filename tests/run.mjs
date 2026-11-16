// A private, ephemeral static host with Pages-style 404 responses; never occupies dev ports.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { spawn } from 'node:child_process';
import config from '../astro.config.mjs';
const root = resolve('dist');
const base = config.base;
let updateTest = false;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/__lumturo_test__/update' && request.method === 'POST') { updateTest = true; response.end('ok'); return; }
  if (base !== '/' && url.pathname === base.slice(0, -1)) { response.writeHead(301, { Location: base }); response.end(); return; }
  if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end('Outside Lumturo scope'); return; }
  const target = resolve(root, '.' + '/' + decodeURIComponent(url.pathname.slice(base.length)));
  if (target !== root && !target.startsWith(root + '/')) { response.writeHead(403); response.end(); return; }
  let path = target;
  let status = 200;
  try { if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html'); await stat(path); }
  catch { path = resolve(root, '404.html'); status = 404; }
  try {
    let body = await readFile(path);
    if (updateTest && path === resolve(root, 'sw.js')) body = Buffer.from(body.toString().replace(/const CACHE = ("[^"]+");/, (_, value) => `const CACHE = ${JSON.stringify(JSON.parse(value) + '-update-test')};`));
    response.writeHead(status, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); response.end(body);
  } catch { response.writeHead(500); response.end('Missing build output'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = `http://127.0.0.1:${server.address().port}${base}`;
console.log(`Private test host: ${address}`);
try {
  for (const test of ['tests/site.mjs', 'tests/pwa.mjs']) {
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [test], { stdio: 'inherit', env: { ...process.env, LUMTURO_URL: address, LUMTURO_TEST_UPDATE: '1' } });
      child.on('error', reject); child.on('exit', resolve);
    });
    if (code !== 0) throw new Error(`${test} exited ${code}`);
  }
} finally { await new Promise(resolve => server.close(resolve)); }
