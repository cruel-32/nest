import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DevTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: '127.0.0.1',
  port: 3399,
  username: 'root',
  password: '1212',
  database: 'robot',
  autoLoadEntities: true,
  logging: true,
  synchronize: false,
};

export const ProdTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: '127.0.0.1',
  port: 3399,
  username: 'root',
  password: '1212',
  database: 'robot',
  autoLoadEntities: true,
  logging: false,
  synchronize: false,
};
