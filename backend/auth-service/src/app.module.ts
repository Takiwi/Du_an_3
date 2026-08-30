import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthExceptionFilter } from './identity/presentation/filters/authExceptions.filter';
import { AppLoggerModule } from '@packages/logging';
import appConfig from './config/app.config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import redisDatabaseConfig from './config/redisDatabase.config';
import jwtConfig from './config/jwt.config';
import cookieConfig from './config/cookie.config';
@Module({
  imports: [
    ClsModule,
    IdentityModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        prismaDatabaseConfig,
        redisDatabaseConfig,
        jwtConfig,
        cookieConfig,
      ],
    }),
    AppLoggerModule.forRoot('auth-service'),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ClsModule,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
