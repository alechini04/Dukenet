import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dukenet.co',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
