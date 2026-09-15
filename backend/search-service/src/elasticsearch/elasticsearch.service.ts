import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleDestroy, OnModuleInit {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
    });
  }

  async onModuleInit() {
    const response = await this.client.info();
    console.log('Hello from Elasticsearch');
    console.log(response);
  }

  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
