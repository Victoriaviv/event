import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

dotenv.config();

const dbUrl = process.env.POSTGRES_URL;
const config = parse(dbUrl);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host ?? 'localhost',
  port: config.port ? parseInt(config.port) : 5432,
  username: config.user ?? 'postgres',
  password: config.password ?? 'postgres',
  database: config.database ?? 'event_management',
  ssl: true,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/entities/*.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  subscribers: [],
});
