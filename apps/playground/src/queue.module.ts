import { Module } from '@nestjs/common';
import { ConfigModule } from 'nest-config-mvp';

import { queueConfig } from './queue.config.js';
import { QueueService } from './queue.service.js';

@Module({
  imports: [ConfigModule.forFeature(queueConfig)],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
