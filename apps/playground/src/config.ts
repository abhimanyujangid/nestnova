import { defineConfig, type InferConfig } from '@novanest/config';
import { z } from 'zod';

export const appConfig = defineConfig({
  env: z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
  }),
  resolve: (env) => ({
    app: {
      env: env.NODE_ENV,
      port: env.PORT,
    },
    database: {
      url: env.DATABASE_URL,
    },
  }),
});

export type AppConfig = InferConfig<typeof appConfig>;
