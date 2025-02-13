import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    includeSource: ['./**/*.{js,ts}'],
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      include: ['./**'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
    fakeTimers: {
      toFake: [...(configDefaults.fakeTimers.toFake ?? []), 'performance'],
    },
  },
})
