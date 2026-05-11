import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  CONFIG_TOKEN,
  ConfigModule,
  defineFeatureConfig,
  defineConfig,
  InjectFeatureConfig,
  InjectConfig,
  type InferConfig,
} from './index.js';
import { getFeatureConfigToken } from './tokens.js';

const appConfig = defineConfig({
  env: z.object({
    DATABASE_URL: z.string().url(),
  }),
  resolve: (env) => ({
    database: {
      url: env.DATABASE_URL,
    },
  }),
});

const queueConfig = defineFeatureConfig('queue', {
  env: z.object({
    REDIS_URL: z.string().url(),
  }),
  resolve: (env) => ({
    redisUrl: env.REDIS_URL,
  }),
});

const authConfig = defineFeatureConfig('auth', {
  env: z.object({
    AUTH_SECRET: z.string().min(12),
  }),
  resolve: (env) => ({
    secret: env.AUTH_SECRET,
  }),
});

describe('ConfigModule', () => {
  it('registers the resolved config as an injectable provider', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(appConfig, {
          env: {
            DATABASE_URL: 'postgres://localhost:5432/app',
          },
        }),
      ],
    }).compile();

    expect(moduleRef.get(CONFIG_TOKEN)).toEqual({
      database: {
        url: 'postgres://localhost:5432/app',
      },
    });
  });

  it('registers feature config through forFeature', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(queueConfig, {
          env: {
            REDIS_URL: 'redis://localhost:6379',
          },
        }),
      ],
    }).compile();

    expect(moduleRef.get(getFeatureConfigToken(queueConfig.namespace))).toEqual({
      redisUrl: 'redis://localhost:6379',
    });
  });

  it('validates only imported feature config definitions', async () => {
    await expect(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(appConfig, {
            env: {
              DATABASE_URL: 'postgres://localhost:5432/app',
            },
          }),
        ],
      }).compile(),
    ).resolves.toBeDefined();
  });

  it('throws when an imported feature config is invalid', () => {
    expect(() =>
      ConfigModule.forFeature(queueConfig, {
        env: {
          REDIS_URL: 'not-a-url',
        },
      }),
    ).toThrow(/Invalid environment configuration:\n- REDIS_URL:/);
  });

  it('keeps feature config namespaces isolated', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(queueConfig, {
          env: {
            REDIS_URL: 'redis://localhost:6379',
          },
        }),
        ConfigModule.forFeature(authConfig, {
          env: {
            AUTH_SECRET: 'super-secret-value',
          },
        }),
      ],
    }).compile();

    expect(moduleRef.get(getFeatureConfigToken(queueConfig.namespace))).toEqual({
      redisUrl: 'redis://localhost:6379',
    });
    expect(moduleRef.get(getFeatureConfigToken(authConfig.namespace))).toEqual({
      secret: 'super-secret-value',
    });
  });

  it('preserves inferred types for feature config definitions', () => {
    type QueueConfig = InferConfig<typeof queueConfig>;
    const config: QueueConfig = {
      redisUrl: 'redis://localhost:6379',
    };

    expect(config.redisUrl).toBe('redis://localhost:6379');
  });

  it('exposes a decorator helper for the config token', () => {
    expect(InjectConfig()).toBeTypeOf('function');
    expect(InjectFeatureConfig(queueConfig)).toBeTypeOf('function');
  });
});
