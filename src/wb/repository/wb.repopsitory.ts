import { Knex } from 'knex';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { KNEX_PROVIDER, TARIFS_BOX_WB_PG_TABLE_NAME } from '../../knex/utils/utils';

import { TarifsBoxWBPostgresTableInsertRepositoryType, TarifsBoxWBPostgresTableRepopsitoryType } from '../utils/types/db/tarifs-box-wb-postgres-table.type';



@Injectable()
export class WBRepository {
  private readonly logger = new Logger(WBRepository.name);

  private tarifsBoxWbModel: Knex.QueryBuilder<TarifsBoxWBPostgresTableRepopsitoryType>;

  constructor(
    @Inject(KNEX_PROVIDER) private readonly knex: Knex, 
  ) {
    this.tarifsBoxWbModel = knex(TARIFS_BOX_WB_PG_TABLE_NAME);
  }


  public async insertOrMergeTarifsBoxData(data: TarifsBoxWBPostgresTableInsertRepositoryType[]): Promise<TarifsBoxWBPostgresTableRepopsitoryType[]> {
    const insertedRows = await this.tarifsBoxWbModel
      .insert(data)
      .onConflict(['warehouse_name', 'record_date'])
      .merge({
        box_delivery_base: this.knex.raw('EXCLUDED.box_delivery_base'),
        box_delivery_coef_expr: this.knex.raw('EXCLUDED.box_delivery_coef_expr'),
        box_delivery_liter: this.knex.raw('EXCLUDED.box_delivery_liter'),
        box_delivery_marketplace_base: this.knex.raw('EXCLUDED.box_delivery_marketplace_base'),
        box_delivery_marketplace_coef_expr: this.knex.raw('EXCLUDED.box_delivery_marketplace_coef_expr'),
        box_delivery_marketplace_liter: this.knex.raw('EXCLUDED.box_delivery_marketplace_liter'),
        box_storage_base: this.knex.raw('EXCLUDED.box_storage_base'),
        box_storage_coef_expr: this.knex.raw('EXCLUDED.box_storage_coef_expr'),
        box_storage_liter: this.knex.raw('EXCLUDED.box_storage_liter'),
        geo_name: this.knex.raw('EXCLUDED.geo_name'),
        updated_at: this.knex.raw("timezone('Europe/Moscow', now())"),
    })
      .returning('*');


    return insertedRows;
  }


  public async getRecords(page: number = 1, pageSize: number = 40) {
    const offset = (page - 1) * pageSize;

    return await this.tarifsBoxWbModel.select('*').limit(pageSize).offset(offset);
  }

  public async deleteAllRecord() {
    return await this.tarifsBoxWbModel.del();
  }

}
