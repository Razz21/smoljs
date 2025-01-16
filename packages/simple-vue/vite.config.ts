import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/jsx-runtime.ts')],
      name: 'SimpleVue',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'min.js'}`,
    },

    rollupOptions: {
      preserveEntrySignatures: "allow-extension",
      external: ['@simple-vue/runtime'],
      output: {
        globals: {
          '@simple-vue/runtime': 'SimpleVueRuntime',
        },
      },
    },
  },

  plugins: [dts({})],
});
