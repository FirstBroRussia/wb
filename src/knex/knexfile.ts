import type { Knex } from 'knex';

const knexConfig: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'wb',
    },
    // migrations: {
    //   directory: './migrations',
    //   extension: 'ts',
    // },
  },
};

export default knexConfig;

