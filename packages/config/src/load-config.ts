import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'dotenv';

import type { ConfigDefinition, ConfigShape, EnvSchema } from './define-config.js';
import { ConfigValidationError } from './errors.js';

export type EnvSource = Record<string, string | undefined>;

export interface LoadConfigOptions {
  /**
   * Useful for tests. Defaults to process.env.
   */
  readonly env?: EnvSource;
  readonly envFilePath?: string | readonly string[];
  readonly overrideEnv?: boolean;
  readonly ignoreMissingEnvFile?: boolean;
}

export function loadConfig<
  const TEnvSchema extends EnvSchema,
  const TConfig extends ConfigShape,
>(
  definition: ConfigDefinition<TEnvSchema, TConfig>,
  options: LoadConfigOptions = {},
): TConfig {
  const env = loadEnv(options);
  const result = definition.env.safeParse(env);

  if (!result.success) {
    throw ConfigValidationError.fromZodError(result.error);
  }

  return definition.resolve(result.data);
}

function loadEnv(options: LoadConfigOptions): EnvSource {
  const env: EnvSource = { ...(options.env ?? process.env) };
  const envFilePaths = normalizeEnvFilePaths(options.envFilePath);

  for (const envFilePath of envFilePaths) {
    if (!existsSync(envFilePath)) {
      if (options.ignoreMissingEnvFile) {
        continue;
      }

      throw new Error(`Environment file not found: ${envFilePath}`);
    }

    const parsedEnv = parse(readFileSync(envFilePath));

    for (const [key, value] of Object.entries(parsedEnv)) {
      if (options.overrideEnv || env[key] === undefined) {
        env[key] = value;
      }
    }
  }

  return env;
}

function normalizeEnvFilePaths(envFilePath: LoadConfigOptions['envFilePath']): readonly string[] {
  if (envFilePath === undefined) {
    return [];
  }

  return typeof envFilePath === 'string' ? [envFilePath] : envFilePath;
}
