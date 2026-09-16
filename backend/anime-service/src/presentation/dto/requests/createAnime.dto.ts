import { CreateAnimeInput } from '@application/usecase/createAnime.contract';
import {
  ArrayUnique,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimeDto implements CreateAnimeInput {
  @ApiProperty({ example: 'Waifu number one' })
  @IsString({ message: 'This field must be a string' })
  @MinLength(2, { message: 'The title must have at least 2 characters' })
  title: string;

  @ApiProperty({ example: 'Spring' })
  @IsString({ message: 'This field must be a string' })
  @MinLength(3, { message: 'The title must have at least 3 characters' })
  season: string;

  @ApiProperty({ example: 'COMING_SOON' })
  @IsString({ message: 'This field must be a string' })
  status: string;

  @ApiProperty({ example: 'MOVIE' })
  @IsString({ message: 'This field must be a string' })
  type: string;

  @ApiProperty({ example: 100 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0, { message: 'This field must be a string' })
  views: number;

  @ApiProperty({ example: '7.6' })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ type: [String], example: ['nestjs', 'typescript'] })
  @ArrayUnique({ message: 'This is must be an array' })
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    type: Date,
    nullable: true,
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'This is must be date' })
  releaseDate: Date | null;

  @ApiProperty({ example: 'True' })
  @IsBoolean({ message: 'This is must be a boolean' })
  isPublished: boolean;

  constructor(
    title: string,
    season: string,
    status: string,
    type: string,
    views: number,
    rating: number,
    categories: string[],
    releaseDate: Date,
    isPublished: boolean,
  ) {
    this.title = title;
    this.season = season;
    this.status = status;
    this.type = type;
    this.views = views;
    this.rating = rating;
    this.categories = categories;
    this.releaseDate = releaseDate;
    this.isPublished = isPublished;
  }
}
