import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = ['index', 'offer', 'shop', 'product', 'cart', 'checkout', 'contact', 'pricing'];

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, `${p}.html`)])),
    },
  },
});
