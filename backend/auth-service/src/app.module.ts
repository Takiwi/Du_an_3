import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthExceptionFilter } from './identity/presentation/filters/authExceptions.filter';
import { AppLoggerModule } from '@packages/logging';
@Module({
  imports: [
    ClsModule,
    IdentityModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.db'] }),
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
