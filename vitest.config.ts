import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      "src/**/*.spec.ts", 
      "src/**/__tests__/*.test.ts",
      "tests/**/*.e2e-spec.ts"
    ],
    exclude: ['node_modules', 'dist'],
    globals: true,
    environment: 'node',
    root: './',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/{promotions,channels,signature}/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/index.ts'],
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Nest requires this
      jsc: {
        target: 'es2021',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true,
        },
      },
    }),
  ],
}); 
