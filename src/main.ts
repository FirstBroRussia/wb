import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


const APP_HOST = 'localhost';
const APP_PORT = 3000;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(process.env.PORT ?? 3000, () => {
    Logger.log(`Приложение запущено на http://${APP_HOST}:${APP_PORT}`);
  });
}
bootstrap();
