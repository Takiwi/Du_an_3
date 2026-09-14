import { Anime } from '@domain/entities/anime/anime.entity';
import { SeriesId } from '@domain/value-objects/seriesId.vo';
import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

export interface IAnimeRepository {
  insertAnime(
    seriesId: SeriesId,
    anime: Anime,
  ): Promise<Result<void, AppError>>;
}
