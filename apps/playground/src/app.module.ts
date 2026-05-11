import { Module } from '@nestjs/common';
import { ConfigModule } from 'nest-config-mvp';

import { AppService } from './app.service.js';
import { appConfig } from './config.js';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig, {
      envFilePath: '.env',
      ignoreMissingEnvFile: true,
      isGlobal: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
