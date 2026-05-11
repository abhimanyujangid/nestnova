import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  ConfigValidationError,
  defineConfig,
  loadConfig,
  type InferConfig,
} from './index.js';

const appConfig = defineConfig({
  env: z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
  }),
  resolve: (env) => ({
    database: {
      url: env.DATABASE_URL,
    },
    app: {
      env: env.NODE_ENV,
      port: env.PORT,
    },
  }),
});

describe('loadConfig', () => {
  it('preserves the resolved config type', () => {
    type AppConfig = InferConfig<typeof appConfig>;
    const config: AppConfig = {
      database: {
        url: 'postgres://localhost:5432/app',
      },
      app: {
        env: 'development',
        port: 3000,
      },
    };

    expect(config.database.url).toBe('postgres://localhost:5432/app');
  });

  it('validates env values and returns the nested config', () => {
    const config = loadConfig(appConfig, {
      env: {
        DATABASE_URL: 'postgres://localhost:5432/app',
        NODE_ENV: 'test',
        PORT: '4000',
      },
    });

    expect(config.database.url).toBe('postgres://localhost:5432/app');
    expect(config.app).toEqual({
      env: 'test',
      port: 4000,
    });
  });

  it('applies Zod defaults', () => {
    const config = loadConfig(appConfig, {
      env: {
        DATABASE_URL: 'postgres://localhost:5432/app',
      },
    });

    expect(config.app).toEqual({
      env: 'development',
      port: 3000,
    });
  });

  it('loads values from an env file', () => {
    const directory = mkdtempSync(join(tmpdir(), 'nest-config-mvp-'));
    const envFilePath = join(directory, '.env');

    writeFileSync(envFilePath, 'DATABASE_URL=postgres://localhost:5432/app\nPORT=5000\n');

    try {
      const config = loadConfig(appConfig, {
        env: {},
        envFilePath,
      });

      expect(config.database.url).toBe('postgres://localhost:5432/app');
      expect(config.app.port).toBe(5000);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it('throws a readable validation error for invalid env', () => {
    expect(() =>
      loadConfig(appConfig, {
        env: {
          DATABASE_URL: 'not-a-url',
          PORT: '-1',
        },
      }),
    ).toThrow(ConfigValidationError);

    expect(() =>
      loadConfig(appConfig, {
        env: {
          DATABASE_URL: 'not-a-url',
          PORT: '-1',
        },
      }),
    ).toThrow(/Invalid environment configuration:\n- DATABASE_URL:/);
  });
});
