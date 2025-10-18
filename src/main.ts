import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app/app.module';


async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);

  Logger.log('Приложение запущено!');
}
bootstrap();
