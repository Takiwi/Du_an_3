import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';
import { PrismaService } from '@infrastructure/database/prisma.service';
import appConfig from './config/app.config';
import rabbitmqConfig from './config/rabbitmq.config';
import { AnimeController } from '@presentation/controllers/anime.controller';

@Module({
  imports: [
    ClsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, prismaDatabaseConfig, rabbitmqConfig],
    }),
  ],
  controllers: [AnimeController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
