import path from 'path';
import { defineConfig } from 'vite';
import { createFilter, normalizePath } from 'vite';
import { transformSync, buildSync } from 'esbuild';

const filter = createFilter(/\.[jt]sx$/);

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [
    {
      name: 'vite-plugin-tsx',
      config() {
        return {
          esbuild: {
            loader: 'tsx',
            jsxFactory: 'jsx',
            jsxFragment: 'Fragment',
            jsxImportSource: 'simple-vue',
            jsxSideEffects: false,
            jsx: 'automatic',
            jsxDev: false,
          },
        };
      },

      // transform(code, id, options) {
      //   if (!filter(id)) return;
      //   const { code: result, map } = transformSync(code, {
      //     loader: 'tsx',
      //     sourcemap: true,
      //     jsx: 'transform',
      //     jsxFactory: '_jsx',
      //     jsxFragment: 'Fragment',
      //     jsxSideEffects: true,
      //     jsxImportSource: '@simple-vue',
      //   });
      //   console.log('transform', id, result);
      //   return {
      //     code: result,
      //     map,
      //   };
      // },
    },
  ],
});
