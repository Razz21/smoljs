/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: pkg.name,
      fileName: (format) => `index.${format === 'es' ? 'js' : 'min.js'}`,
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    environment: 'happy-dom',
  },
});
