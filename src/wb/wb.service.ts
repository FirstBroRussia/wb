import { AxiosInstance, AxiosError } from 'axios';

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { WBRepository } from './repository/wb.repopsitory';

import { conversionToNumberOrNull } from './utils/utils';
import { WB_HTTP_AUTHORIZATION_API_KEY, WB_TARIFS_BOX_HTTP_URL } from 'src/knex/utils/utils';
import { WBApiResponseType, WBWarehouseTarifsBoxType } from './utils/types/api/wb-api.types';
import { TarifsBoxWBPostgresTableInsertRepositoryType } from './utils/types/db/tarifs-box-wb-postgres-table.type';



@Injectable()
export class WbService {
  private readonly logger = new Logger(WbService.name);

  private readonly axiosHttpClient: AxiosInstance;


  constructor(
    httpService: HttpService,
    private readonly wbRepository: WBRepository,
  ) {
    this.axiosHttpClient = httpService.axiosRef;
  }


  public async getWBTarifsBoxData() {
    const currentDataString = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Moscow',
    }).format(new Date());

    const res = await this.axiosHttpClient.get(`${WB_TARIFS_BOX_HTTP_URL}?date=${currentDataString}`, {
      headers: {
        Authorization: WB_HTTP_AUTHORIZATION_API_KEY,
      },
    }).catch((err) => {
      if (!(err instanceof AxiosError)) throw err;

      const errResponse = err.response;

      this.logger.error(errResponse?.status);
      this.logger.error(errResponse?.data);

      // Дальнейшая логика для обработки ошибок
      // Дальнейшая логика для обработки ошибок
      // Дальнейшая логика для обработки ошибок
    });

    const resData: WBApiResponseType<WBWarehouseTarifsBoxType> = res!.data;
    const warehouseList = resData.response.data.warehouseList;

    const formattedWarehouseList: TarifsBoxWBPostgresTableInsertRepositoryType[] = warehouseList.map((item) => ({
      box_delivery_base: conversionToNumberOrNull(item.boxDeliveryBase),
      box_delivery_coef_expr: conversionToNumberOrNull(item.boxDeliveryCoefExpr),
      box_delivery_liter: conversionToNumberOrNull(item.boxDeliveryLiter),
      box_delivery_marketplace_base: conversionToNumberOrNull(item.boxDeliveryMarketplaceBase),
      box_delivery_marketplace_coef_expr: conversionToNumberOrNull(item.boxDeliveryMarketplaceCoefExpr),
      box_delivery_marketplace_liter: conversionToNumberOrNull(item.boxDeliveryMarketplaceLiter),
      box_storage_base: conversionToNumberOrNull(item.boxStorageBase),
      box_storage_coef_expr: conversionToNumberOrNull(item.boxStorageCoefExpr),
      box_storage_liter: conversionToNumberOrNull(item.boxStorageLiter),
      geo_name: item.geoName,
      warehouse_name: item.warehouseName,
      record_date: currentDataString,
    } as unknown as TarifsBoxWBPostgresTableInsertRepositoryType)
    );

    const rows = await this.wbRepository.insertOrMergeTarifsBoxData(formattedWarehouseList);
    this.logger.log('✅ Данные в БД о тарифах на коробки обновлены');


    return rows;
  }


}
