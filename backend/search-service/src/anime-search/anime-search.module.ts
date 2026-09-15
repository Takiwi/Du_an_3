import { Module } from '@nestjs/common';
import { AnimeSearchService } from './anime-search.service';
import { ElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';
import { AnimeSearchController } from './anime-search.controller';

@Module({
  imports: [ElasticsearchModule],
  providers: [AnimeSearchService],
  exports: [AnimeSearchService],
  controllers: [AnimeSearchController],
})
export class AnimeSearchModule {}
