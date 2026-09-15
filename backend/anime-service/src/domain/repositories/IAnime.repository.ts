import { Anime } from '@domain/entities/anime/anime.entity';
import { SeriesId } from '@domain/value-objects/seriesId.vo';
import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export const ANIME_REPOSITORY = 'IAnimeRepository';

export interface IAnimeRepository {
  insertAnime(
    seriesId: SeriesId,
    anime: Anime,
  ): Promise<Result<void, AppError>>;

  isExistsOrInsert(
    seriesId: SeriesId,
    anime: Anime,
  ): Promise<Result<Anime, AppError>>;
}
