import { google, sheets_v4  } from 'googleapis';
import { drive_v3 } from 'googleapis/build/src/apis/drive';
import { GaxiosError } from 'gaxios';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleHttpErrorResponseType } from './utils/types/types';
import { TarifsBoxWBPostgresTableRepopsitoryType } from 'src/wb/utils/types/db/tarifs-box-wb-postgres-table.type';

import { AppEnvInterface } from 'src/app/utils/interface/app-env.interface';



@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  private readonly sheets: sheets_v4.Sheets;
  private readonly drive: drive_v3.Drive;
  

  constructor(
    private readonly configService: ConfigService<AppEnvInterface>,
  ) {
    const googleAuth = new google.auth.GoogleAuth({
      keyFile: configService.get('GOOGLE_ACCOUNT_JSON_FILE_PATH')!,

      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    this.sheets = google.sheets({ version: 'v4', auth: googleAuth, });
    this.drive = google.drive({ version: 'v3', auth: googleAuth });
  }


  async updateDataToStockCoefSheets(sheetsIds: string[], titleSheet: string, data?: TarifsBoxWBPostgresTableRepopsitoryType[]) {
    for (const spreadSheetId of sheetsIds) {
      let isBreakLoop = false;

      // Проверяем, что таблица существует
      await this.sheets.spreadsheets.get({ spreadsheetId: spreadSheetId }).catch((err) => {
        if (!(err instanceof GaxiosError)) throw err;
  
        const errorObj: GoogleHttpErrorResponseType = err.response?.data.error;
  
        if (errorObj.code === 404) {
          this.logger.warn(`Таблица с ID: ${spreadSheetId} не существует!`);

          isBreakLoop = true;

          return;
        };
  
        throw err;
      });
      
      if (isBreakLoop) break;

      this.logger.log(`✅ Успешный доступ к таблице: ${spreadSheetId}`);
  
      // Добавляем нужный лист с нашим названием, а если есть, то пропускаем
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadSheetId,
        requestBody: {
          requests: [
            { addSheet: { properties: { title: titleSheet } } }
          ]
        }
      }).catch((err) => {
        if (!(err instanceof GaxiosError)) throw err;
  
        const errorObj: GoogleHttpErrorResponseType = err.response?.data.error;
  
        if (errorObj.code === 400 && errorObj.status === 'INVALID_ARGUMENT') return;
  
        throw err;
      });
  
  
      // Размещаем нужные данные на листе таблицы
      const rows = [
        [
          'Название склада',                    // Warehouse Name
          'Регион',                             // Geo Name
          'Базовая доставка',                   // box_delivery_base
          'Коэффициент доставки',               // box_delivery_coef_expr
          'Литраж доставки',                    // box_delivery_liter
          'Базовая доставка маркетплейс',       // box_delivery_marketplace_base
          'Коэффициент доставки маркетплейс',   // box_delivery_marketplace_coef_expr
          'Литраж доставки маркетплейс',        // box_delivery_marketplace_liter
          'Базовое хранение',                   // box_storage_base
          'Коэффициент хранения',               // box_storage_coef_expr
          'Объём хранения',                     // box_storage_liter
          'Дата записи',                        // record_date
        ],
        ...data!.map(d => [
          d.warehouse_name,
          d.geo_name,
          d.box_delivery_base ?? '',
          d.box_delivery_coef_expr ?? '',
          d.box_delivery_liter ?? '',
          d.box_delivery_marketplace_base ?? '',
          d.box_delivery_marketplace_coef_expr ?? '',
          d.box_delivery_marketplace_liter ?? '',
          d.box_storage_base ?? '',
          d.box_storage_coef_expr ?? '',
          d.box_storage_liter ?? '',
          d.record_date,
        ]),
      ];
  
      // Очищаем лист перед вставкой
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: spreadSheetId,
        range: titleSheet,
      });
  
      // Записываем данные
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: spreadSheetId,
        range: titleSheet,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: rows },
      });
  
      this.logger.log(`✅ Данные успешно выгружены в таблицу: ${spreadSheetId}`);
    }

  }

}
