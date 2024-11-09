import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'env-var';

export const typeOrmConfig: TypeOrmModuleOptions = {
  host: get('DB_HOST').default('localhost').asString(),
  port: get('DB_PORT').default(3306).asPortNumber(),
  username: get('DB_USERNAME').required().asString(),
  password: get('DB_PASSWORD').required().asString(),
  database: get('DB_NAME').required().asString(),
  synchronize: get('DB_SYNC').default('false').asBool(),
  dropSchema: get('DB_DROP').default('false').asBool(),
  type: 'mysql',
  autoLoadEntities: true,
};
