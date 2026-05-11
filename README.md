# NestNova

NestNova is an early-stage developer tooling ecosystem for NestJS.

The goal is not to replace NestJS or create another backend framework. The goal is to build small, focused libraries that make NestJS applications simpler to configure, easier to maintain, and nicer to work with.

The first package is a typed configuration library for environment loading, validation, clean config access, and feature-isolated config registration.

## Why This Exists

Configuration in many NestJS projects often becomes repetitive:

- environment variables are read manually
- validation setup is repeated across projects
- config values are accessed through string keys
- missing values fail at runtime
- autocomplete is limited

NestNova starts by improving that workflow with a typed config package.

Instead of this:

```ts
configService.get('DATABASE_URL');
```

The preferred direction is this:

```ts
config.database.url;
```

## Current Packages

| Package | Status | Purpose |
| --- | --- | --- |
| `packages/config` | MVP | Typed environment configuration for NestJS |
| `packages/queue` | MVP | Lightweight BullMQ queue integration for NestJS |

The config package is now tracked as `@novanest/config` inside the workspace.

## Quick Start

Install dependencies:

```bash
pnpm install
```

Run all checks:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Run the playground app:

```bash
cp apps/playground/.env.example apps/playground/.env
pnpm --filter playground start
```

## Basic Example

```ts
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
```

Then inject the resolved config in a NestJS provider:

```ts
constructor(@InjectConfig() private readonly config: AppConfig) {}
```

For full package documentation, see [`packages/config/README.md`](packages/config/README.md).

## Project Structure

```txt
apps/
  playground/     Local NestJS app for testing packages
packages/
  config/         Reusable typed configuration package
  queue/          Lightweight BullMQ queue package
```

## Development Philosophy

NestNova is built around a few simple rules:

- developer experience first
- simple APIs over clever abstractions
- strong TypeScript types
- production-ready defaults
- clear documentation
- focused packages that solve one problem well

## Current Scope

The current focus is the foundation layer:

- load environment variables
- validate values with Zod
- expose typed nested config
- integrate cleanly with NestJS dependency injection
- validate feature config only when that feature module is imported
- provide a lightweight queue module powered by BullMQ and Redis

Not in scope yet:

- auth
- notifications
- payments
- AI generators
- complex infrastructure

Build one excellent library first, then expand carefully.
