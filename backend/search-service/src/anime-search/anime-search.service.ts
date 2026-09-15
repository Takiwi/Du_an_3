import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Injectable()
export class AnimeSearchService implements OnModuleInit {
  private readonly index = 'anime';

  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async onModuleInit() {
    await this.createIndex();
  }

  async createIndex() {
    const client = this.elasticsearch.getClient();

    const exists = await client.indices.exists({ index: this.index });

    if (exists) {
      return;
    }

    await client.indices.create({
      index: this.index,
      mappings: {
        properties: {
          id: {
            type: 'keyword',
          },
          title: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
            },
          },
          categories: {
            type: 'keyword',
          },
          releaseDate: {
            type: 'integer',
          },
          description: {
            type: 'text',
          },
          status: {
            type: 'keyword',
          },
          type: {
            type: 'keyword',
          },
          season: {
            type: 'keyword',
          },
          rating: {
            type: 'float',
          },
          views: {
            type: 'integer',
          },
        },
      },
    });
  }

  async indexAnime(anime: {
    id: string;
    title: string;
    description: string;
    releaseDate: number;
    rating: number;
    categories: string[];
    status: string;
    type: string;
    season: string;
    views: number;
  }) {
    const client = this.elasticsearch.getClient();

    await client.index({
      index: this.index,
      id: anime.id,
      document: anime,
    });

    await client.indices.refresh({
      index: this.index,
    });
  }

  async searchAnime(keyword: string) {
    const client = this.elasticsearch.getClient();

    const results = await client.search({
      index: this.index,

      query: {
        multi_match: {
          query: keyword,
          fields: ['title^3', 'description'],
        },
      },
    });

    return results.hits.hits;
  }
}
