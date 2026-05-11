export interface QueueSetupEnvVariable {
  readonly name: string;
  readonly example: string;
  readonly required: boolean;
  readonly description: string;
}

export interface QueueSetupMetadata {
  readonly packageName: '@novanest/queue';
  readonly moduleName: 'QueueModule';
  readonly importPath: '@novanest/queue';
  readonly env: readonly QueueSetupEnvVariable[];
}

export const queueSetup = {
  packageName: '@novanest/queue',
  moduleName: 'QueueModule',
  importPath: '@novanest/queue',
  env: [
    {
      name: 'QUEUE_REDIS_URL',
      example: 'redis://localhost:6379',
      required: true,
      description: 'Redis connection URL used by BullMQ queues.',
    },
  ],
} satisfies QueueSetupMetadata;
