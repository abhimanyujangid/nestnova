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

export interface FeatureConfigDefinition<
  TNamespace extends string = string,
  TEnvSchema extends EnvSchema = EnvSchema,
  TConfig extends ConfigShape = ConfigShape,
> extends ConfigDefinition<TEnvSchema, TConfig> {
  readonly namespace: TNamespace;
}

export interface ConfigDefinitionLike {
  readonly env: EnvSchema;
  readonly resolve: (...args: never[]) => ConfigShape;
}

export interface FeatureConfigDefinitionLike extends ConfigDefinitionLike {
  readonly namespace: string;
}

export type AnyRootConfigDefinition = ConfigDefinitionLike;

export type AnyFeatureConfigDefinition = FeatureConfigDefinitionLike;

export type AnyConfigDefinition = AnyRootConfigDefinition | AnyFeatureConfigDefinition;

export type InferConfig<TDefinition> =
  TDefinition extends { readonly resolve: (...args: never[]) => infer TConfig }
    ? TConfig
    : never;

export function defineConfig<
  const TEnvSchema extends EnvSchema,
  const TConfig extends ConfigShape,
>(definition: ConfigDefinition<TEnvSchema, TConfig>): ConfigDefinition<TEnvSchema, TConfig> {
  return definition;
}

export function defineFeatureConfig<
  const TNamespace extends string,
  const TEnvSchema extends EnvSchema,
  const TConfig extends ConfigShape,
>(
  namespace: TNamespace,
  definition: ConfigDefinition<TEnvSchema, TConfig>,
): FeatureConfigDefinition<TNamespace, TEnvSchema, TConfig> {
  return {
    ...definition,
    namespace,
  };
}
