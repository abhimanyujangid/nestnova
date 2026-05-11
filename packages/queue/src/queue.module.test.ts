import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import {
  queueConfig,
  QueueModule,
  queueSetup,
  type QueueConfig,
} from './index.js';

describe('QueueModule', () => {
  it('registers queue infrastructure when Redis config is valid', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        QueueModule.forRoot({
          config: {
            env: {
              QUEUE_REDIS_URL: 'redis://localhost:6379',
            },
          },
        }),
      ],
    }).compile();

    expect(moduleRef).toBeDefined();
  });

  it('fails when QUEUE_REDIS_URL is missing', () => {
    expect(() =>
      QueueModule.forRoot({
        config: {
          env: {},
        },
      }),
    ).toThrow(/Invalid environment configuration:\n- QUEUE_REDIS_URL:/);
  });

  it('fails when QUEUE_REDIS_URL is invalid', () => {
    expect(() =>
      QueueModule.forRoot({
        config: {
          env: {
            QUEUE_REDIS_URL: 'not-a-url',
          },
        },
      }),
    ).toThrow(/Invalid environment configuration:\n- QUEUE_REDIS_URL:/);
  });

  it('keeps queue config typed and package-owned', () => {
    type ResolvedQueueConfig = QueueConfig;
    const config: ResolvedQueueConfig = {
      redis: {
        url: 'redis://localhost:6379',
      },
    };

    expect(queueConfig.namespace).toBe('queue');
    expect(config.redis.url).toBe('redis://localhost:6379');
  });

  it('exposes setup metadata for future CLI automation', () => {
    expect(queueSetup).toEqual({
      packageName: '@novanest/queue',
      moduleName: 'QueueModule',
      importPath: '@novanest/queue',
      env: [
        {
          name: 'QUEUE_REDIS_URL',
          example: 'redis://localhost:6379',
          required: true,
          description: 'Redis connection URL used by BullMQ queues.',
        },
      ],
    });
  });
});
