import { AnimeRelation } from '@domain/entities/animeRelation/animeRelation.entity';
import { AnimeId } from '@domain/value-objects/animeId.vo';

export const ANIME_RELATION_REPOSITORY = 'IAnimeRelationRepository';

export interface IAnimeRelationRepository {
  insertAnimeRelation(animeRelation: AnimeRelation): Promise<void>;
  isCreateCycle(fromAnimeId: AnimeId, toAnimeId: AnimeId): Promise<boolean>;
  existsBetween(fromAnimeId: AnimeId, toAnimeId: AnimeId): Promise<boolean>;
}
