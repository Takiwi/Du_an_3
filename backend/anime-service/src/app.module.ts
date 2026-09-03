import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import { PrismaService } from './shared/database/prisma.service';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';

@Module({
  imports: [
    ClsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [prismaDatabaseConfig],
    }),
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
