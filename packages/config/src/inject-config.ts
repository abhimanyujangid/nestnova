import { Inject } from '@nestjs/common';

import type {
  ConfigShape,
  EnvSchema,
  FeatureConfigDefinition,
} from './define-config.js';
import { getFeatureConfigToken, ROOT_CONFIG_TOKEN } from './tokens.js';

export const CONFIG_TOKEN = ROOT_CONFIG_TOKEN;

export function InjectConfig(): ReturnType<typeof Inject> {
  return Inject(CONFIG_TOKEN);
}

export function InjectFeatureConfig<
  const TNamespace extends string,
  const TEnvSchema extends EnvSchema,
  const TConfig extends ConfigShape,
>(
  definition: FeatureConfigDefinition<TNamespace, TEnvSchema, TConfig>,
): ReturnType<typeof Inject> {
  return Inject(getFeatureConfigToken(definition.namespace));
}
