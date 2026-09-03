import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // `npm run build -- --mode analyze` writes dist/stats.html
    mode === 'analyze' &&
      visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }),
  ].filter(Boolean),

  build: {
    target: 'es2020',
    // Hashed build output goes to /build, NOT /assets. public/assets/ is copied
    // to dist/assets/ verbatim, and mixing the two makes it impossible to serve
    // hashed files as `immutable` without also freezing the un-hashed images.
    assetsDir: 'build',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split the vendor libraries so a page-code change doesn't bust the
        // cache on ~150KB of React that never changes.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          search: ['fuse.js'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: false,
  },
}));
