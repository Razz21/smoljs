import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/jsx-runtime.ts')],
      name: pkg.name,
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'min.js'}`,
    },

    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
      // external: ['@smoljs/runtime'],
      // output: {
      //   globals: {
      //     '@smoljs/runtime': 'SmoljsRuntime',
      //   },
      // },
    },
  },

  plugins: [dts({})],
});
