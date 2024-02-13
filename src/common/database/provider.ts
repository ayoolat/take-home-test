import { databaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseConfigAttributes } from './interface/config.interface';
import { join } from 'path';

export const databaseProviders = [
  {
    provide: 'TypeORM',
    useFactory: async () => {
      let config: IDatabaseConfigAttributes;
      switch (process.env.NODE_ENV) {
        case 'DEVELOPMENT':
          config = databaseConfig.development;
          break;
        case 'TEST':
          config = databaseConfig.test;
          break;
        case 'PRODUCTION':
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      return TypeOrmModule.forRoot({
        type: 'postgres',
        host: config.host,
        port: config.port,
        password: config.password,
        username: config.username,
        entities: ['src/**/*.entity.{ts}'],
        database: config.database,
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      });
    },
  },
];
