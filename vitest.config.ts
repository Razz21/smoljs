import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      {
        // add "extends" to merge two configs together
        // extends: './vite.config.js',
        test: {
          include: ['tests/**/*.{browser}.test.{ts,js}'],
          // it is recommended to define a name when using inline configs
          name: 'happy-dom',
          environment: 'happy-dom',
        },
      },
      {
        test: {
          include: ['tests/**/*.{node}.test.{ts,js}'],
          name: 'node',
          environment: 'node',
        },
      },
    ],
    coverage: {
      all: true,
      enabled: true,
      provider: 'v8',
      include: ['packages/**/src/**/*.{ts,js}'],
    },
  },
});
