# nest-config-mvp

Typed environment configuration for NestJS applications.

This package is an early MVP. It focuses on one clean workflow:

1. Define the raw environment schema with Zod.
2. Validate values at startup.
3. Resolve validated values into a nested config object.
4. Inject that object into NestJS services.

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

## API

- `defineConfig(definition)`: stores the Zod env schema and resolver.
- `InferConfig<typeof appConfig>`: infers the resolved nested config type.
- `loadConfig(definition, options)`: validates and resolves config outside Nest.
- `ConfigModule.forRoot(definition, options)`: registers config in Nest.
- `InjectConfig()`: injects the resolved config provider.

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
