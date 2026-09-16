import { Anime } from '@domain/entities/anime/anime.entity';
import { IAnimeRepository } from '@domain/repositories/IAnime.repository';
import { AnimeId } from '@domain/value-objects/animeId.vo';
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

  async isExistsManyId(ids: AnimeId[]): Promise<string[]> {
    const results = await this.client.anime.findMany({
      where: {
        id: { in: ids.map((id) => id.toString()) },
      },
      select: { id: true },
    });

    return results.map((result) => result.id);
  }

  async findManyById(ids: AnimeId[]): Promise<Anime[]> {
    const results = await this.client.anime.findMany({
      where: {
        id: { in: ids.map((id) => id.toString()) },
      },
      include: { categories: { select: { categoryId: true } } },
    });

    return results.map((result) => {
      const categoryId = result.categories.map((id) => id.categoryId);

      return Anime.reconstitute({ ...result, categories: categoryId });
    });
  }

  async isExistsOrInsert(anime: Anime): Promise<Result<Anime, AppError>> {
    const releaseDate = anime.getReleaseSchedule().getReleaseDate();
    const season = anime.getReleaseSchedule().getSeason();

    const result = await asyncHandlerPrismaError(async () => {
      return await this.client.anime.upsert({
        where: {
          title_season_author_studio: {
            title: anime.getTitle(),
            author: anime.getAuthor(),
            studio: anime.getStudio(),
            season: season,
          },
        },
        update: {},
        create: {
          id: anime.getId().toString(),
          title: anime.getTitle(),
          season: season,
          releaseDate: releaseDate,
          isPublished: anime.getIsPublic(),
          rating: anime.getRating(),
          status: anime.getStatus(),
          type: anime.getType(),
          views: anime.getViews(),
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
        ...finalResult,
        categories: finalResult.categories.map((cate) => cate.categoryId),
      }),
    );
  }

  async insertAnime(anime: Anime): Promise<Result<void, AppError>> {
    return await asyncHandlerPrismaError(async () => {
      await this.client.anime.create({
        data: {
          id: anime.getId().toString(),
          title: anime.getTitle(),
          author: anime.getAuthor(),
          studio: anime.getStudio(),
          season: anime.getReleaseSchedule().getSeason(),
          rating: anime.getRating(),
          status: anime.getStatus(),
          type: anime.getType(),
          views: anime.getViews(),
          releaseDate: anime.getReleaseSchedule().getReleaseDate(),
          categories: {
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
