import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: [resolve(__dirname, 'src/index.ts')],
      name: 'Router',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'min.js'}`,
    },

    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
      external: ['@smoljs/runtime'],
      output: {
        globals: {
          '@smoljs/runtime': 'SmoljsRuntime',
        },
      },
    },
  },

  plugins: [dts({ rollupTypes: true })],
});
