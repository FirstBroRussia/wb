import knex, { Knex } from 'knex';
import knexConfig from './knexfile';

import { Global, Logger, Module } from '@nestjs/common';

import { KNEX_PROVIDER } from './utils/utils';



@Global()
@Module({
  providers: [
    {
      provide: KNEX_PROVIDER,
      useFactory: async (): Promise<Knex> => {
        const knexInstance = knex(knexConfig['development']);

        try {
          await knexInstance.raw('SELECT 1');
          Logger.log('✅ Соединение с БД установлено', KNEX_PROVIDER);
        } catch (err) {
          throw err;
        }


        return knexInstance;
      },
    },
  ],
  exports: [KNEX_PROVIDER],
})
export class KnexModule {}
