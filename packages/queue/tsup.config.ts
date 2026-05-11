import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  external: [
    '@nestjs/bullmq',
    '@nestjs/common',
    '@nestjs/core',
    '@novanest/config',
    'bullmq',
    'zod',
  ],
});
