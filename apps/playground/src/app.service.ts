import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@novanest/config';

import type { AppConfig } from './config.js';

@Injectable()
export class AppService {
  constructor(@InjectConfig() private readonly config: AppConfig) {}

  getSummary(): string {
    return `Playground ready on port ${this.config.app.port} using ${this.config.database.url}`;
  }
}
