import { Module } from '@nestjs/common';
import { ConfigModule } from 'nest-config-mvp';

import { AppService } from './app.service.js';
import { appConfig } from './config.js';
import { QueueModule } from './queue.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig, {
      envFilePath: '.env',
      ignoreMissingEnvFile: true,
      isGlobal: true,
    }),
    QueueModule,
  ],
  providers: [AppService],
})
export class AppModule {}
