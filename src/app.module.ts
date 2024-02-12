import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { PreAuthMiddleware } from './auth/auth/firebase/middlewares/auth.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './common/filter/error.filter';
import { UserModule } from './user/user.module';
import { databaseProviders } from './common/database/provider';

@Module({
  imports: [
    databaseProviders[0].useFactory(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompanyModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    CommonModule,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.ALL },
        { path: '/auth/register', method: RequestMethod.ALL },
        { path: '/auth/login', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
