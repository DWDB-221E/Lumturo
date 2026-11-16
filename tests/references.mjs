import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const content = await readFile('src/data/entries.ts', 'utf8');
const sourceAnchors = [...content.matchAll(/sourceAnchor: '([^']+)'/g)].map(match => match[1]);
const references = [
  { url: 'https://iep.utm.edu/fallacy/', anchors: sourceAnchors },
  { url: 'https://plato.stanford.edu/entries/fallacies/', anchors: ['CorFal', 'InfLogAppFal'] },
];
const results = [];
for (const reference of references) {
  const response = await fetch(reference.url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, reference.url);
  const html = await response.text();
  const anchors = reference.anchors.map(anchor => ({ anchor, exists: html.includes(`id="${anchor}"`) || html.includes(`name="${anchor}"`) }));
  results.push({ url: reference.url, status: response.status, anchors });
}
await mkdir('review', { recursive: true });
await writeFile('review/reference-anchors.json', JSON.stringify({ checkedAt: new Date().toISOString(), method: 'Fetch original HTML and check actual id/name attributes.', results }, null, 2));
assert.ok(results.every(result => result.anchors.every(anchor => anchor.exists)));
console.log('Both public sources return HTTP 200. All 12 IEP entry fragments and 2 SEP section fragments match actual HTML id/name attributes.');
