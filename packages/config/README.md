# nest-config-mvp

Typed environment configuration for NestJS applications.

This package is an early MVP. It focuses on two clean workflows:

1. Define the raw environment schema with Zod.
2. Validate values at startup.
3. Resolve validated values into a nested config object.
4. Inject that object into NestJS services.

Use root config for application-wide values and feature config for optional modules.

## Define Config

```ts
import { defineConfig, type InferConfig } from 'nest-config-mvp';
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
```

## Register In NestJS

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nest-config-mvp';

import { appConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig, {
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## Inject Config

```ts
import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nest-config-mvp';

import type { AppConfig } from './config';

@Injectable()
export class DatabaseService {
  constructor(@InjectConfig() private readonly config: AppConfig) {}

  connect() {
    return this.config.database.url;
  }
}
```

## Feature Config

Feature config lets ecosystem packages register their own schemas only when those packages are enabled.

```ts
import { defineFeatureConfig, type InferConfig } from 'nest-config-mvp';
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
```

Register the feature config inside the feature module:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from 'nest-config-mvp';

import { queueConfig } from './queue.config';

@Module({
  imports: [ConfigModule.forFeature(queueConfig)],
})
export class QueueModule {}
```

Inject the feature config by definition:

```ts
import { Injectable } from '@nestjs/common';
import { InjectFeatureConfig } from 'nest-config-mvp';

import { queueConfig, type QueueConfig } from './queue.config';

@Injectable()
export class QueueService {
  constructor(
    @InjectFeatureConfig(queueConfig)
    private readonly config: QueueConfig,
  ) {}
}
```

`QUEUE_REDIS_URL` is validated only when `QueueModule` imports `ConfigModule.forFeature(queueConfig)`.

## API

- `defineConfig(definition)`: stores the Zod env schema and resolver.
- `defineFeatureConfig(namespace, definition)`: defines config for an optional feature namespace.
- `InferConfig<typeof appConfig>`: infers the resolved nested config type.
- `loadConfig(definition, options)`: validates and resolves config outside Nest.
- `ConfigModule.forRoot(definition, options)`: registers config in Nest.
- `ConfigModule.forFeature(definition, options)`: registers feature config in Nest.
- `InjectConfig()`: injects the resolved config provider.
- `InjectFeatureConfig(definition)`: injects a resolved feature config provider.

## Options

```ts
ConfigModule.forRoot(appConfig, {
  envFilePath: '.env',
  overrideEnv: false,
  ignoreMissingEnvFile: false,
  isGlobal: true,
});
```

## Current Limitations

This MVP intentionally does not support async factories, remote secret providers, config hot reloading, multiple named config namespaces, or generators. Those can be added later after the core API feels right.
