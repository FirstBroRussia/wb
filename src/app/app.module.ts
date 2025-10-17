import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { KnexModule } from '../knex/knex.module';

import { WbService } from '../wb/wb.service';
import { AppService } from './app.service';
import { GoogleService } from '../google/google.service';

import { WBRepository } from '../wb/repository/wb.repopsitory';

import { appEnvConfigValidateFn } from './utils/config/app-env.config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.ENV_PATH || '.env',
      validate: appEnvConfigValidateFn,
    }),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    KnexModule,
  ],
  providers: [
    WBRepository,
    WbService,
    GoogleService,
    AppService,
  ],
})
export class AppModule {}
