import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import type {
  ConfigDefinition,
  ConfigShape,
  EnvSchema,
  FeatureConfigDefinition,
} from './define-config.js';
import { loadConfig, type LoadConfigOptions } from './load-config.js';
import { getFeatureConfigToken, ROOT_CONFIG_TOKEN } from './tokens.js';

export interface ConfigModuleOptions extends LoadConfigOptions {
  readonly isGlobal?: boolean;
}

@Module({})
export class ConfigModule {
  static forRoot<
    const TEnvSchema extends EnvSchema,
    const TConfig extends ConfigShape,
  >(
    definition: ConfigDefinition<TEnvSchema, TConfig>,
    options: ConfigModuleOptions = {},
  ): DynamicModule {
    const configProvider: Provider = {
      provide: ROOT_CONFIG_TOKEN,
      useValue: loadConfig(definition, options),
    };

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: [configProvider],
      exports: [configProvider],
    };
  }

  static forFeature<
    const TNamespace extends string,
    const TEnvSchema extends EnvSchema,
    const TConfig extends ConfigShape,
  >(
    definition: FeatureConfigDefinition<TNamespace, TEnvSchema, TConfig>,
    options: LoadConfigOptions = {},
  ): DynamicModule {
    const configProvider: Provider = {
      provide: getFeatureConfigToken(definition.namespace),
      useValue: loadConfig(definition, options),
    };

    return {
      module: ConfigModule,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
