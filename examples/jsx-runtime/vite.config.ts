import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'tsx',
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
    jsxImportSource: 'smoljs',
    jsxSideEffects: false,
    jsx: 'automatic',
    jsxDev: false,
  },
});
