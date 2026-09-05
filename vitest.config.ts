import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'lib/engine/scoring.ts',
        'lib/engine/sharing.ts',
        'lib/engine/storage.ts',
        'lib/engine/chemistry.ts',
        'app/api/score/route.ts',
      ],
      thresholds: { lines: 95, functions: 95, branches: 85, statements: 95 },
    },
  },
});
