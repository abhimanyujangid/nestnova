# @novanest/queue

Lightweight BullMQ queue integration for NovaNest applications.

This package does not create a custom queue engine. It wraps the official NestJS BullMQ integration with NovaNest conventions, package-owned config validation, and setup metadata for future CLI automation.

## Install

```bash
pnpm add @novanest/queue @novanest/config @nestjs/bullmq bullmq
```

## Environment

Add Redis connection configuration:

```env
QUEUE_REDIS_URL=redis://localhost:6379
```

This value is validated only when `QueueModule.forRoot()` is imported.

## Usage

```ts
import { Module } from '@nestjs/common';
import { QueueModule } from '@novanest/queue';

@Module({
  imports: [QueueModule.forRoot()],
})
export class AppModule {}
```

Register a BullMQ queue:

```ts
@Module({
  imports: [
    QueueModule.forRoot(),
    QueueModule.registerQueue('emails'),
  ],
})
export class AppModule {}
```

## Config Integration

`@novanest/queue` owns its feature config:

```ts
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
```

Applications should not redefine this schema. Importing `QueueModule.forRoot()` registers the queue config with `@novanest/config`.

## CLI Readiness

The package exports `queueSetup`, a small metadata object a future CLI can use for:

- installing `@novanest/queue`
- adding `QueueModule.forRoot()` to an app module
- appending `QUEUE_REDIS_URL` to `.env` and `.env.example`

The runtime package does not depend on CLI tooling.

## Not Included Yet

This MVP intentionally does not include custom workers, decorators, dashboards, retries UI, workflow orchestration, notification systems, or CLI file modification logic.
