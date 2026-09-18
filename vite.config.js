import { defineConfig } from 'vite';
import { projectMarkup } from './scripts/content.mjs';
export default defineConfig({
  plugins: [{ name: 'nge-project-content', transformIndexHtml: html => html.replace('<!-- NGE_PROJECTS -->', projectMarkup()) }],
  base: './',
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  build: { target: 'es2022', assetsInlineLimit: 0 },
});
