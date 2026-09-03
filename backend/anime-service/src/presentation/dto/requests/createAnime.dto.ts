import { CreateAnimeInput } from '@auth/application/usecase/createAnime.contract';
import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateAnimeDto implements CreateAnimeInput {
  @IsString({ message: 'This field must be a string' })
  @MinLength(2, { message: 'The title must have at least 2 characters' })
  title: string;

  @IsString({ message: 'This field must be a string' })
  @MinLength(3, { message: 'The title must have at least 3 characters' })
  season: string;

  @IsString({ message: 'This field must be a string' })
  status: string;

  @IsString({ message: 'This field must be a string' })
  type: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0, { message: 'This field must be a string' })
  views: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  constructor(
    title: string,
    season: string,
    status: string,
    type: string,
    views: number,
    rating: number,
  ) {
    this.title = title;
    this.season = season;
    this.status = status;
    this.type = type;
    this.views = views;
    this.rating = rating;
  }
}
