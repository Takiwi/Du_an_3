import { Anime } from '@domain/entities/anime/anime.entity';
import { AnimeId } from '@domain/value-objects/animeId.vo';
import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export const ANIME_REPOSITORY = 'IAnimeRepository';

export interface IAnimeRepository {
  findManyById(ids: AnimeId[]): Promise<Anime[]>;
  insertAnime(anime: Anime): Promise<Result<void, AppError>>;
  isExistsOrInsert(anime: Anime): Promise<Result<Anime, AppError>>;
  isExistsManyId(ids: AnimeId[]): Promise<string[]>;
}
