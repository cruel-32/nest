import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';

console.log('process.env.NODE_ENV : ', process.env.NODE_ENV);

config({
  path: join(
    __dirname,
    '..',
    process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
  ),
});

console.log('process.env.DATABASE_HOST : ', process.env.DATABASE_HOST);

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
