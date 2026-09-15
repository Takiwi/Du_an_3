import { Anime } from '@domain/entities/anime/anime.entity';
import { IAnimeRepository } from '@domain/repositories/IAnime.repository';
import { SeriesId } from '@domain/value-objects/seriesId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';
import { Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class AnimeRepository implements IAnimeRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async isExistsOrInsert(
    seriesId: SeriesId,
    anime: Anime,
  ): Promise<Result<Anime, AppError>> {
    const result = await asyncHandlerPrismaError(async () => {
      return await this.client.anime.upsert({
        where: {
          title_releaseDate: {
            title: anime.getTitle(),
            releaseDate: anime.getReleaseDate() ?? '',
          },
        },
        update: {},
        create: {
          id: anime.getId().toString(),
          title: anime.getTitle(),
          season: anime.getSeason(),
          releaseDate: anime.getReleaseDate(),
          isPublished: anime.getIsPublic(),
          rating: anime.getRating(),
          status: anime.getStatus(),
          type: anime.getTypes(),
          view: anime.getViews(),
          categories: {
            create: anime.getCategories().map((cate) => ({
              category: {
                connect: { id: cate.toString() },
              },
            })),
          },
        },
        include: {
          categories: { where: { animeId: anime.getId().toString() } },
        },
      });
    });

    if (result.isErr()) {
      return err(result.error);
    }

    const finalResult = result.value;

    return ok(
      Anime.reconstitute({
        id: finalResult.id,
        title: finalResult.title,
        season: finalResult.season,
        status: finalResult.status,
        type: finalResult.type,
        views: finalResult.view,
        rating: finalResult.rating,
        releaseDate: finalResult.releaseDate,
        isPublished: finalResult.isPublished,
        categories: finalResult.categories.map((cate) => cate.categoryId),
      }),
    );
  }

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
                  id: cate.toString(),
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
