import type { Knex } from 'knex';


const DATABASE_URL = process.env.DATABASE_URL! || 'postgres://postgres:postgres@localhost:5432/postgres';

const config: Record<string, Knex.Config> = {
  development: {
    client: 'pg',
    connection: DATABASE_URL,
    // migrations: {
    //   directory: './migrations',
    //   extension: 'ts',
    // },
  },
};

export default config;

