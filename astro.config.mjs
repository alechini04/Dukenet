import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dukenet.co',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  // Las herramientas de herramientas/ esperan el preview en este puerto.
  server: { port: 4323, host: '127.0.0.1' },
});
