import type { Knex } from 'knex';


const DB_HOST = '127.0.0.1';
const DB_PORT = 33333;
const DB_USER = 'postgres';
const DB_PASSWORD = 'postgres';
const DB_DATABASE_NAME = 'postgres';


const knexConfig: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE_NAME,
    },
    // migrations: {
    //   directory: './migrations',
    //   extension: 'ts',
    // },
  },
};

export default knexConfig;

