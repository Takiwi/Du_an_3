import { Module } from '@nestjs/common';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { AnimeSearchModule } from './anime-search/anime-search.module';
import { AnimeSearchController } from './anime-search/anime-search.controller';
import { AnimeGrpcController } from './anime-search/animeGrpc.controller';
import { RabbitMqModule } from './modules/rabbitMq.module';

@Module({
  imports: [ElasticsearchModule, AnimeSearchModule, RabbitMqModule],
  controllers: [AnimeSearchController, AnimeGrpcController],
})
export class AppModule {}
