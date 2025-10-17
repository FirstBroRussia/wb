import type { Knex } from "knex";

import { TARIFS_BOX_WB_PG_TABLE_NAME } from "../utils/utils";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await knex.schema.createTable(TARIFS_BOX_WB_PG_TABLE_NAME, (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.timestamp('created_at').defaultTo(knex.raw("timezone('Europe/Moscow', now())")).notNullable();
    table.timestamp('updated_at').defaultTo(knex.raw("timezone('Europe/Moscow', now())")).notNullable();
    
    table.float('box_delivery_base').nullable();
    table.float('box_delivery_coef_expr', 10, 5).nullable();
    table.float('box_delivery_liter', 10, 5).nullable();
    table.float('box_delivery_marketplace_base', 10, 5).nullable();
    table.float('box_delivery_marketplace_coef_expr', 10, 5).nullable();
    table.float('box_delivery_marketplace_liter', 10, 5).nullable();
    table.float('box_storage_base', 10, 5).nullable();
    table.float('box_storage_coef_expr', 10, 5).nullable();
    table.float('box_storage_liter', 10, 5).nullable();

    table.string('geo_name', 255).notNullable();
    table.string('warehouse_name', 255).notNullable();
    
    table.string('record_date', 100).notNullable();


    table.unique(['warehouse_name', 'record_date']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TARIFS_BOX_WB_PG_TABLE_NAME);
}

