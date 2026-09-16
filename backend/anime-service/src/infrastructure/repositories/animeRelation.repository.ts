import { AnimeRelation } from '@domain/entities/animeRelation/animeRelation.entity';
import { IAnimeRelationRepository } from '@domain/repositories/IAnimeRelation.repository';
import { AnimeId } from '@domain/value-objects/animeId.vo';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { asyncHandlerPrismaError } from '@infrastructure/helpers/asyncHandlerPrismaError.helper';
import { PrismaTransaction } from '@infrastructure/services/prisma-transaction-context.service';

export class AnimeRelationRepository implements IAnimeRelationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaTransaction: PrismaTransaction,
  ) {}

  async existsBetween(
    fromAnimeId: AnimeId,
    toAnimeId: AnimeId,
  ): Promise<boolean> {
    return await this.client.$queryRaw<boolean>`
      SELECT 1 FROM "AnimeRelation"
      WHERE ("fromAnimeId" = ${fromAnimeId.toString()} AND "toAnimeId" = ${toAnimeId.toString()})
      OR ("fromAnimeId" = ${toAnimeId.toString()} AND "toAnimeId" = ${fromAnimeId.toString()})
      LIMIT 1
    `;
  }

  async isCreateCycle(
    fromAnimeId: AnimeId,
    toAnimeId: AnimeId,
  ): Promise<boolean> {
    const result = await this.client.$queryRaw<{ exists: number }[]>`
      WITH RECURSIVE ancestors AS (
        SELECT "fromAnimeId", "toAnimeId"
        FROM "AnimeRelation"
        WHERE "fromAnimeId" = ${toAnimeId.toString()} AND "relationType" IN ('PREQUEL', 'SEQUEL')

        UNION ALL

        SELECT a."fromAnimeId", r."toAnimeId"
        FROM ancestors a
        JOIN "AnimeRelation" r ON a."toAnimeId" = r."fromAnimeId"
        WHERE r."relationType" IN ('PREQUEL', 'SEQUEL')
      ) 
      SELECT 1 AS exists
      FROM ancestors
      WHERE "toAnimeId" = ${fromAnimeId.toString()}
      LIMIT 1;
    `;

    return result.length > 0;
  }

  async insertAnimeRelation(animeRelation: AnimeRelation): Promise<void> {
    await asyncHandlerPrismaError(async () => {
      await this.client.animeRelation.create({
        data: {
          id: animeRelation.getId().toString(),
          fromAnimeId: animeRelation.getFromAnimeId().toString(),
          toAnimeId: animeRelation.getToAnimeId().toString(),
          relationType: animeRelation.getRelationType().getValue(),
        },
      });
    });
  }

  private get client() {
    return this.prismaTransaction.getPrismaClient(this.prisma);
  }
}
