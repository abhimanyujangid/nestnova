export const ROOT_CONFIG_TOKEN = Symbol.for('@novanest/config/root');

const FEATURE_CONFIG_TOKEN_PREFIX = '@novanest/config/feature';

export function getFeatureConfigToken(namespace: string): symbol {
  return Symbol.for(`${FEATURE_CONFIG_TOKEN_PREFIX}:${namespace}`);
}
