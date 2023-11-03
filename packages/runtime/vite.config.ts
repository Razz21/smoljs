import path, { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      // rollupTypes: true, // output single file
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimpleVue',
      // the proper extensions will be added
      fileName: 'lib',
      formats: ['cjs', 'es', 'umd'],
    },
  },
});
