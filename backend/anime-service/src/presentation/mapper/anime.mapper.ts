import { Anime } from '@domain/entities/anime/anime.entity';
import { AnimeResponseDto } from '@presentation/dto/responses/animeResponse.dto';

export const animeMapper = (anime: Anime): AnimeResponseDto => {
  return {
    id: anime.getId().toString(),
    title: anime.getTitle(),
    author: anime.getAuthor(),
    studio: anime.getStudio(),
    season: anime.getReleaseSchedule().getSeason(),
    status: anime.getStatus(),
    type: anime.getType(),
    views: anime.getViews(),
    rating: anime.getRating(),
    categories: anime.getCategories().map((cate) => cate.toString()),
    releaseDate: anime.getReleaseSchedule().getReleaseDate(),
  };
};
