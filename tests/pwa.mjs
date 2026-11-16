import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import config from '../astro.config.mjs';
const base = new URL(process.env.LUMTURO_URL || `http://127.0.0.1:4311${config.base}`);
if (!base.pathname.endsWith('/')) base.pathname += '/';
const at = path => new URL(path, base).href;
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
try {
  await page.goto(at('manifest.webmanifest'));
  await page.evaluate(async basePath => {
    await caches.open('tekstaro:foreign-test');
    await caches.open(`lumturo:${basePath}:old-test`);
  }, base.pathname);
  await page.goto(base.href);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const registration = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { scope: reg.scope, script: reg.active.scriptURL, keys: await caches.keys() };
  });
  assert.equal(registration.scope, base.href);
  assert.equal(registration.script, at('sw.js'));
  assert.ok(registration.keys.includes('tekstaro:foreign-test'));
  assert.ok(!registration.keys.includes(`lumturo:${base.pathname}:old-test`));
  results.push('Service worker controls page at exact deployment scope; own old cache cleaned; foreign Tekstaro cache retained.');
  const manifestResponse = await page.request.get(at('manifest.webmanifest'));
  assert.equal(manifestResponse.status(), 200);
  const manifest = await manifestResponse.json();
  for (const key of ['id', 'start_url', 'scope']) assert.equal(manifest[key], base.pathname);
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.name.includes('灯塔') && manifest.description.includes('逻辑'));
  for (const icon of manifest.icons) {
    const response = await page.request.get(new URL(icon.src, base).href);
    assert.equal(response.status(), 200);
    assert.ok(response.headers()['content-type'].includes('image/png'));
    const png = await response.body();
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
    assert.equal(await page.evaluate(async src => {
      const image = new Image(); image.src = src; await image.decode(); return `${image.naturalWidth}x${image.naturalHeight}`;
    }, icon.src), icon.sizes);
  }
  results.push('Manifest HTTP 200 with correct identity/scope/start URL; actual PNG icons decode at declared 192×192 and 512×512.');
  await page.goto(at('entries/authority/'));
  await page.reload();
  assert.equal(await page.locator('h1').innerText(), '不当诉诸权威');
  assert.equal(await page.locator('nav[aria-label="主导航"] a[aria-current="page"]').count(), 0);
  const missing = await page.request.get(at('missing/deep/path/'));
  assert.equal(missing.status(), 404);
  // A direct 404 artifact check remains meaningful on both Astro preview and Pages.
  const notFound = await page.request.get(at('404.html'));
  assert.equal(notFound.status(), 200);
  assert.ok((await notFound.text()).includes(`${base.pathname}library/`));
  results.push('Direct article navigation and refresh pass; unknown deep path returns HTTP 404 and generated 404 recovery link remains inside base.');
  const session = await context.newCDPSession(page);
  const { installabilityErrors } = await session.send('Page.getInstallabilityErrors');
  assert.deepEqual(installabilityErrors, []);
  results.push('Chromium reports no installability errors (does not prove every platform’s manual install experience).');
  await context.setOffline(true);
  await page.goto(at('library/?q=专家'));
  assert.ok(await page.locator('[data-entry]:visible').count() > 0);
  await page.goto(at('entries/false-cause/'));
  await page.reload();
  assert.equal(await page.locator('h1').innerText(), '虚假因果');
  await page.goto(at('not-saved/offline/'));
  assert.equal(await page.locator('h1').innerText(), '这条路径尚未保存');
  await page.getByRole('link', { name: '打开离线条目索引 →' }).click();
  assert.equal(await page.locator('[data-entry]:visible').count(), 12);
  results.push('Real offline navigations: search query, different article, refresh, unknown-route offline notice and recovery all pass.');
  const cachedUrls = await page.evaluate(async () => {
    const all = [];
    for (const key of await caches.keys()) if (key.startsWith('lumturo:')) for (const request of await (await caches.open(key)).keys()) all.push(request.url);
    return all;
  });
  assert.ok(cachedUrls.length > 20);
  for (const cached of cachedUrls) {
    const url = new URL(cached);
    assert.equal(url.origin, base.origin); assert.ok(url.pathname.startsWith(base.pathname)); assert.equal(url.search, '');
  }
  results.push(`All ${cachedUrls.length} cache entries are finite local build URLs; query strings and external URLs absent.`);
  await context.setOffline(false);
  // Exercise the update handshake and own-prefix cache cleanup with a controlled worker.
  assert.equal(process.env.LUMTURO_TEST_UPDATE, '1', 'Update simulation requires tests/run.mjs private host');
  await page.request.post(new URL('/__lumturo_test__/update', base).href);
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration()).waiting));
  await page.locator('#pwa-update').waitFor({ state: 'visible' });
  await Promise.all([page.waitForEvent('load'), page.locator('#pwa-update').click()]);
  await page.waitForFunction(async () => !(await navigator.serviceWorker.getRegistration()).waiting);
  const updatedKeys = await page.evaluate(() => caches.keys());
  assert.ok(updatedKeys.includes('tekstaro:foreign-test'));
  assert.equal(updatedKeys.filter(key => key.startsWith(`lumturo:${base.pathname}:`)).length, 1);
  assert.ok(updatedKeys.some(key => key.endsWith('-update-test')));
  results.push('Controlled update waits for user action, activates and reloads; own obsolete cache removed while foreign cache survives.');
  assert.deepEqual(errors, []);
  results.push('Observed PWA browser page errors / unexpected console errors: 0.');
  await mkdir('review', { recursive: true });
  await writeFile('review/pwa-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), base: base.href, manifest, registration, installabilityErrors, results, errors }, null, 2));
  console.log(results.join('\n'));
} finally { await browser.close(); }
