import { defineConfig } from 'vite';

// base './' makes the built site work from any folder or sub-path
// (Netlify, GitHub Pages project sites, etc.).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
});
