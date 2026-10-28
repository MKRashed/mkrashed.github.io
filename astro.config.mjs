import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(
  process.env.NODE_ENV || 'production',
  process.cwd(),
  'SITE_URL',
);

// Set SITE_URL to the real production origin when deploying.
export default defineConfig({
  site: SITE_URL || undefined,
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
