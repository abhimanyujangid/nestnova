import type { z, ZodType } from 'zod';

export type ConfigShape = Record<string, unknown>;

export type EnvSchema = ZodType<Record<string, unknown>>;

export interface ConfigDefinition<
  TEnvSchema extends EnvSchema = EnvSchema,
  TConfig extends ConfigShape = ConfigShape,
> {
  readonly env: TEnvSchema;
  readonly resolve: (env: z.output<TEnvSchema>) => TConfig;
}

export type AnyConfigDefinition = ConfigDefinition<EnvSchema, ConfigShape>;

export type InferConfig<TDefinition extends AnyConfigDefinition> =
  TDefinition extends ConfigDefinition<EnvSchema, infer TConfig> ? TConfig : never;

export function defineConfig<
  const TEnvSchema extends EnvSchema,
  const TConfig extends ConfigShape,
>(definition: ConfigDefinition<TEnvSchema, TConfig>): ConfigDefinition<TEnvSchema, TConfig> {
  return definition;
}
