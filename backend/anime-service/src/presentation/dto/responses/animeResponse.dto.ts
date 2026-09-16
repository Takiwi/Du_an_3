import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateAnimeDto } from '../requests/createAnime.dto';
import { IdResponseDto } from '@packages/api-docs';

export class AnimeResponseDto extends IntersectionType(
  OmitType(CreateAnimeDto, ['isPublished'] as const),
  IdResponseDto,
) {}
