import path from 'node:path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
  {
    failOnWarn: false,
    name: 'runtime',
    entries: ['./src/index.ts'],
    outDir: 'dist',
    declaration: 'compatible',
    sourcemap: true,
    clean: true,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    rollup: {
      emitCJS: true,
    },
  },
]);
