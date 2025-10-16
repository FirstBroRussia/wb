import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { KnexModule } from './knex/knex.module';

import { WbService } from './wb/wb.service';

import { WBRepository } from './wb/repository/wb.repopsitory';



@Module({
  imports: [
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
  ],
})
export class AppModule {}
