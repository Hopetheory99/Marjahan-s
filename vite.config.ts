import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
    ViteImageOptimizer({
      // Include all common image formats
      include: ['**/*.{png,jpg,jpeg,svg,gif,tiff,bmp,ico}'],
      // Quality settings for different formats
      png: {
        quality: 85,
      },
      jpeg: {
        quality: 85,
        mozjpeg: true,
      },
      jpg: {
        quality: 85,
        mozjpeg: true,
      },
      webp: {
        quality: 90,
      },
      avif: {
        quality: 85,
      },
      // SVG optimization
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
      // Enable caching for better build performance
      cache: true,
    }),
  ],
  optimizeDeps: {
    include: ['typesense', 'fuse.js'],
  },
  build: {
    commonjsOptions: {
      include: [/typesense/, /fuse\.js/, /node_modules/],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
