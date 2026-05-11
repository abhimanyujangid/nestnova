import { defineFeatureConfig, type InferConfig } from '@novanest/config';
import { z } from 'zod';

export const queueConfig = defineFeatureConfig('queue', {
  env: z.object({
    QUEUE_REDIS_URL: z.string().url(),
  }),
  resolve: (env) => ({
    redis: {
      url: env.QUEUE_REDIS_URL,
    },
  }),
});

export type QueueConfig = InferConfig<typeof queueConfig>;
