import { Anime } from '@domain/entities/anime/anime.entity';
import { IAnimeRepository } from '@domain/repositories/IAnime.repository';
import { SeriesId } from '@domain/value-objects/seriesId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { Result } from 'neverthrow';

@Injectable()
export class AnimeRepository implements IAnimeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async insertAnime(
    seriesId: SeriesId,
    anime: Anime,
  ): Promise<Result<void, AppError>> {
    return await asyncHandlerPrismaError(async () => {
      await this.client.anime.create({
        data: {
          id: anime.getId().toString(),
          title: anime.getTitle(),
          season: anime.getSeason(),
          rating: anime.getRating(),
          status: anime.getStatus(),
          type: anime.getTypes(),
          view: anime.getViews(),
          seriesId: seriesId.toString(),
          animeCategories: {
            create: anime.getCategories().map((cate) => ({
              category: {
                connect: {
                  id: cate,
                },
              },
            })),
          },
        },
      });
    });
  }

  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prisma);
  }
}
