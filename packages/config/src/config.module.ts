import type { DynamicModule, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import type { AnyConfigDefinition } from './define-config.js';
import { CONFIG_TOKEN } from './inject-config.js';
import { loadConfig, type LoadConfigOptions } from './load-config.js';

export interface ConfigModuleOptions extends LoadConfigOptions {
  readonly isGlobal?: boolean;
}

@Module({})
export class ConfigModule {
  static forRoot(
    definition: AnyConfigDefinition,
    options: ConfigModuleOptions = {},
  ): DynamicModule {
    const configProvider: Provider = {
      provide: CONFIG_TOKEN,
      useValue: loadConfig(definition, options),
    };

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
