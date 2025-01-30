import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['packages/**/src/**/*.{ts,js}'],
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60,
      },
    },
  },
});
