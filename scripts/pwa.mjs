import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Only the finite, size-limited build output is cached. No runtime URLs are added.
export function lumturoPwa(base) {
  return { name: 'lumturo-pwa', hooks: { 'astro:build:done': async ({ dir }) => {
    const root = fileURLToPath(dir);
    const manifest = {
      lang: 'zh-CN', name: 'Lumturo 灯塔 · 逻辑科普', short_name: 'Lumturo 灯塔',
      description: '从论证结构到证据边界，学习怎样检查理由。12 条中文逻辑谬误教学手册，可离线阅读。',
      id: base, scope: base, start_url: base, display: 'standalone',
      theme_color: '#a63d3d', background_color: '#faf8f3',
      icons: [192, 512].map(size => ({ src: `${base}icons/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })),
    };
    await writeFile(join(root, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
    await writeFile(join(root, '.nojekyll'), '');
    const files = [];
    async function walk(directory, prefix = '') {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const relative = `${prefix}${entry.name}`;
        if (entry.isDirectory()) await walk(join(directory, entry.name), `${relative}/`);
        else if (/\.(html|css|js|svg|png|webmanifest)$/.test(relative) && relative !== 'sw.js') {
          const bytes = await readFile(join(directory, entry.name));
          if (bytes.length > 512 * 1024) throw new Error(`PWA asset exceeds 512 KiB: ${relative}`);
          files.push({ relative, bytes });
        }
      }
    }
    await walk(root);
    files.sort((a, b) => a.relative.localeCompare(b.relative));
    const total = files.reduce((size, file) => size + file.bytes.length, 0);
    if (total > 5 * 1024 * 1024) throw new Error('PWA build cache exceeds 5 MiB budget.');
    // Include worker implementation changes so activation never reuses an old cache namespace.
    const version = createHash('sha256').update(await readFile(fileURLToPath(import.meta.url)));
    for (const file of files) version.update(file.relative).update(file.bytes);
    const urls = files.map(({ relative }) => base + relative.replace(/index\.html$/, ''));
    const prefix = `lumturo:${base}:`;
    const cache = `${prefix}${version.digest('hex').slice(0, 16)}`;
    const worker = `// Generated from the finite Lumturo build. Do not cache runtime or external requests.
const BASE = ${JSON.stringify(base)};
const PREFIX = ${JSON.stringify(prefix)};
const CACHE = ${JSON.stringify(cache)};
const URLS = ${JSON.stringify(urls)};
const ALLOWED = new Set(URLS);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'LUMTURO_ACTIVATE') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  // Queries may contain private input: never store them, nor serve them as cache keys.
  if (url.search && request.mode !== 'navigate') return;
  const path = url.pathname;
  if (!ALLOWED.has(path) && request.mode !== 'navigate') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate') {
      try { return await fetch(request); }
      catch {
        const cached = ALLOWED.has(path) ? await cache.match(path) : null;
        return cached || await cache.match(BASE + 'offline/') || new Response('当前离线，请联网后重试。', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    }
    return await cache.match(path) || fetch(request);
  })());
});
`;
    await writeFile(join(root, 'sw.js'), worker);
    console.log(`Lumturo PWA: ${urls.length} assets, ${total} bytes; cache ${cache}`);
  } } };
}
