import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
  {
    failOnWarn: false,
    name: 'simple-vue',
    entries: ['./src/index.ts', './src/jsx-runtime/index.ts'],
    outDir: 'dist',
    declaration: 'compatible',
    sourcemap: false,
    clean: true,
    rollup: {
      emitCJS: true,
    },
    externals: ['@simple-vue/runtime'],
  },
]);
