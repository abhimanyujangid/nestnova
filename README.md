# nestnova

A small learning-focused NestJS developer tooling library for typed environment configuration.

The goal of this repository is to build one high-quality package before expanding into a larger ecosystem. The current package is intentionally narrow: validate environment variables with Zod, resolve them into a clean nested object, and inject that object into NestJS.

## Workspace

```txt
apps/
  playground/     Local NestJS app for manual testing
packages/
  config/         Reusable config library package
```

## Scripts

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

Run the playground:

```bash
cp apps/playground/.env.example apps/playground/.env
pnpm --filter playground start
```

## Example

```ts
import { ConfigModule, defineConfig, InjectConfig, type InferConfig } from 'nest-config-mvp';
import { z } from 'zod';

const appConfig = defineConfig({
  env: z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  }),
  resolve: (env) => ({
    database: {
      url: env.DATABASE_URL,
    },
    app: {
      env: env.NODE_ENV,
    },
  }),
});

type AppConfig = InferConfig<typeof appConfig>;
```

```ts
@Module({
  imports: [ConfigModule.forRoot(appConfig, { isGlobal: true })],
})
export class AppModule {}
```

```ts
@Injectable()
export class DatabaseService {
  constructor(@InjectConfig() private readonly config: AppConfig) {}

  connect() {
    return this.config.database.url;
  }
}
```

## MVP Scope

Included now:

- process env loading
- optional `.env` file loading
- Zod validation
- Zod defaults
- typed nested config output
- NestJS dynamic module integration

Not included yet:

- CLI generators
- remote secrets
- hot reloading
- async factories
- multiple named config namespaces
- larger ecosystem packages

The package name `nest-config-mvp` is temporary and should be renamed before publishing.
