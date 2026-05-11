import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { AppService } from './app.service.js';
import { QueueService } from './queue.service.js';

const app = await NestFactory.createApplicationContext(AppModule);
const appService = app.get(AppService);
const queueService = app.get(QueueService);

console.log(appService.getSummary());
console.log(queueService.getSummary());

await app.close();
