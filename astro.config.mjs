import { defineConfig } from 'astro/config';
import { lumturoPwa } from './scripts/pwa.mjs';

const rawBase = process.env.LUMTURO_BASE ?? '/Lumturo/';
if (!rawBase.startsWith('/') || /[?#\\\s]/.test(rawBase) || rawBase.includes('..')) throw new Error('LUMTURO_BASE must be an absolute URL path.');
const segments = rawBase.split('/').filter(Boolean).join('/');
const base = segments ? `/${segments}/` : '/';
export default defineConfig({
  output: 'static', trailingSlash: 'always', base,
  site: process.env.LUMTURO_SITE ?? 'https://dwdb-221e.github.io',
  integrations: [lumturoPwa(base)],
});
