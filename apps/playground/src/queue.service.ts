import { Injectable } from '@nestjs/common';
import { InjectFeatureConfig } from 'nest-config-mvp';

import { queueConfig, type QueueConfig } from './queue.config.js';

@Injectable()
export class QueueService {
  constructor(
    @InjectFeatureConfig(queueConfig)
    private readonly config: QueueConfig,
  ) {}

  getSummary(): string {
    return `Queue feature ready using ${this.config.redis.url}`;
  }
}
