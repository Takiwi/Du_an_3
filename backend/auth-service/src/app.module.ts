import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { ClsModule } from '@packages/core/cls/cls.module';
import { RequestIdMiddleware } from '@packages/core/middlewares/requestId.middleware';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [ClsModule, IdentityModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ClsModule,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
