import { Anime } from '@domain/entities/anime/anime.entity';
import { createdAnimeEventSchema } from '@packages/contracts';
import { AppError } from '@packages/pattern';

export const animeEventMapper = (anime: Anime, version: number) => {
  const mapper = createdAnimeEventSchema(version).safeParse(anime);

  if (mapper.error)
    throw new AppError(
      'CONVERT_FAIL',
      `Can't not convert anime instance so event instance`,
    );

  return mapper.data;
};
