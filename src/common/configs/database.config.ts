import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'env-var';

export const typeOrmConfig: TypeOrmModuleOptions = {
  host: get('DATABASE_HOST').default('localhost').asString(),
  port: get('DATABASE_PORT').default(3306).asPortNumber(),
  username: get('DATABASE_USER').required().asString(),
  password: get('DATABASE_PASSWORD').required().asString(),
  database: get('DATABASE_NAME').required().asString(),
  synchronize: get('DATABASE_SYNC').default('true').asBool(),
  dropSchema: get('DATABASE_DROP').default('true').asBool(),
  type: 'mysql',
  autoLoadEntities: true,
};
