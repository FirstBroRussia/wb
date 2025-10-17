import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { GoogleService } from 'src/google/google.service';
import { WbService } from 'src/wb/wb.service';

import { AppEnvInterface } from './utils/interface/app-env.interface';



@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private readonly STOCKS_COEF_SHEET_NAME = 'stocks_coefs';


  constructor(
    private readonly configService: ConfigService<AppEnvInterface>,
    private readonly wbService: WbService,
    private readonly googleService: GoogleService,
  ) { }


  @Timeout(3000)
  @Cron(CronExpression.EVERY_HOUR)
  async init() {
    const rows = await this.wbService.getWBTarifsBoxData();

    this.googleService.updateDataToStockCoefSheets(this.configService.get('GOOGLE_SHEETS_IDS')!, this.STOCKS_COEF_SHEET_NAME, rows);
  }
  
}
