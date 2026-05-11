import { Module } from '@nestjs/common';
import { ConfigModule } from '@novanest/config';
import { QueueModule } from '@novanest/queue';

import { AppService } from './app.service.js';
import { appConfig } from './config.js';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig, {
      envFilePath: '.env',
      ignoreMissingEnvFile: true,
      isGlobal: true,
    }),
    QueueModule.forRoot(),
  ],
  providers: [AppService],
})
export class AppModule {}
