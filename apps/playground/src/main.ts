import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { AppService } from './app.service.js';

const app = await NestFactory.createApplicationContext(AppModule);
const appService = app.get(AppService);

console.log(appService.getSummary());

await app.close();
