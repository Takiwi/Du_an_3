import { IAnimeSearch } from '@application/ports/IAnimeSearch.port';
import { Anime } from '@domain/entities/anime/anime.entity';
import { AnimeId } from '@domain/value-objects/animeId.vo';

export class AnimeSearch implements IAnimeSearch {
  index(anime: Anime): Promise<void> {
    throw new Error('Method not implemented.');
  }

  remove(animeId: AnimeId): Promise<void> {
    throw new Error('Method not implemented.');
  }

  search(query: string): Promise<Anime[]> {
    throw new Error('Method not implemented.');
  }

  checkDuplicate(title: string): Promise<Anime[]> {
    throw new Error('Method not implemented.');
  }
}
