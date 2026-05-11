import {
  BullModule,
  type BullRootModuleOptions,
  type RegisterQueueOptions,
} from '@nestjs/bullmq';
import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import {
  ConfigModule,
  getFeatureConfigToken,
  type LoadConfigOptions,
} from '@novanest/config';

import { queueConfig, type QueueConfig } from './queue.config.js';

export interface QueueModuleOptions {
  readonly config?: LoadConfigOptions;
  readonly bull?: Omit<BullRootModuleOptions, 'connection'>;
}

export type QueueRegistrationOptions = Omit<RegisterQueueOptions, 'name'>;

@Module({})
export class QueueModule {
  static forRoot(options: QueueModuleOptions = {}): DynamicModule {
    const configModule = ConfigModule.forFeature(queueConfig, options.config);
    const bullModule = BullModule.forRootAsync({
      imports: [configModule],
      inject: [getFeatureConfigToken(queueConfig.namespace)],
      useFactory: (config: QueueConfig): BullRootModuleOptions => ({
        ...options.bull,
        connection: {
          url: config.redis.url,
        },
      }),
    });

    return {
      module: QueueModule,
      imports: [bullModule],
      exports: [bullModule],
    };
  }

  static registerQueue(
    name: string,
    options: QueueRegistrationOptions = {},
  ): DynamicModule {
    return BullModule.registerQueue({
      ...options,
      name,
    });
  }
}
