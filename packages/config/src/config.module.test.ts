import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  CONFIG_TOKEN,
  ConfigModule,
  defineConfig,
  InjectConfig,
} from './index.js';

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

  it('exposes a decorator helper for the config token', () => {
    expect(InjectConfig()).toBeTypeOf('function');
  });
});
