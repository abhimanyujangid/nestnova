export {
  defineFeatureConfig,
  defineConfig,
  type AnyConfigDefinition,
  type AnyFeatureConfigDefinition,
  type AnyRootConfigDefinition,
  type ConfigDefinition,
  type ConfigShape,
  type EnvSchema,
  type FeatureConfigDefinition,
  type InferConfig,
} from './define-config.js';
export {
  loadConfig,
  type EnvSource,
  type LoadConfigOptions,
} from './load-config.js';
export {
  ConfigValidationError,
  formatValidationError,
} from './errors.js';
export {
  ConfigModule,
  type ConfigModuleOptions,
} from './config.module.js';
export {
  CONFIG_TOKEN,
  InjectFeatureConfig,
  InjectConfig,
} from './inject-config.js';
export {
  getFeatureConfigToken,
  ROOT_CONFIG_TOKEN,
} from './tokens.js';
