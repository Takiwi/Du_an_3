import { IMessage } from '@application/ports/IMessage.port';
import { Anime } from '@domain/entities/anime/anime.entity';
import { animeEventMapper } from '@infrastructure/mappers/animeEvent.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SearchFacadeService implements IMessage {
  constructor(
    @Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy,
  ) {}

  publisher(anime: Anime, version: number = 1) {
    const data = animeEventMapper(anime, version);

    this.searchClient.emit('Search queue', data);
  }
}
