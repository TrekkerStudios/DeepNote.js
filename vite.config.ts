import { defineConfig } from 'vite';
import build from '@hono/vite-build/cloudflare-workers';

export default defineConfig({
  plugins: [
    build({
      entry: 'src/index.jsx',
    }),
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: '_worker.js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});