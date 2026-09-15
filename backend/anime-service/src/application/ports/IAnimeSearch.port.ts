import { Anime } from '@domain/entities/anime/anime.entity';
import { AnimeId } from '@domain/value-objects/animeId.vo';

export const ANIME_SEARCH = 'IAnimeSearch';

export interface IAnimeSearch {
  index(anime: Anime): Promise<void>;
  remove(animeId: AnimeId): Promise<void>;
  search(query: string): Promise<Anime[]>;
  checkDuplicate(title: string): Promise<Anime[]>;
}
