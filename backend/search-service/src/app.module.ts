import { Module } from '@nestjs/common';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { AnimeSearchModule } from './anime-search/anime-search.module';
import { AnimeSearchController } from './anime-search/anime-search.controller';
import { GRpcController } from './anime-search/gRpc.controller';

@Module({
  imports: [ElasticsearchModule, AnimeSearchModule],
  controllers: [AnimeSearchController, GRpcController],
})
export class AppModule {}
