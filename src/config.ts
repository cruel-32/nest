import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  autoLoadEntities: true,
  logging: true,
  synchronize: false,
};
