import { RelationType } from '@generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class RelationAnime {
  @ApiProperty({ example: '12bn213-...' })
  @IsString({ message: 'This is must be string' })
  relationAnimeId: string;

  @ApiProperty({ example: 'SPIN_OFF' })
  @IsEnum(RelationType, {
    message: `Relationship type must be one of the valid values (${Object.values(RelationType).join(', ')})`,
  })
  @IsString({ message: 'This is must be string' })
  relationType: RelationType;

  constructor(relationAnimeId: string, relationType: RelationType) {
    this.relationAnimeId = relationAnimeId;
    this.relationType = relationType;
  }
}
