import knex, { Knex } from 'knex';
import config from './knexfile';

import { Global, Logger, Module } from '@nestjs/common';

import { KNEX_PROVIDER } from './utils/utils';
import { ConfigService } from '@nestjs/config';
import { AppEnvInterface } from 'src/app/utils/interface/app-env.interface';



@Global()
@Module({
  providers: [
    {
      provide: KNEX_PROVIDER,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppEnvInterface>): Promise<Knex> => {
        config['development'].connection = configService.get('DATABASE_URL');

        const knexInstance = knex(config['development']);

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
