/*
  Warnings:

  - You are about to drop the column `seriesId` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the `Series` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE');

-- DropForeignKey
ALTER TABLE "Anime" DROP CONSTRAINT "Anime_seriesId_fkey";

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "seriesId";

-- DropTable
DROP TABLE "Series";

-- CreateTable
CREATE TABLE "AnimeRelation" (
    "id" TEXT NOT NULL,
    "fromAnimeId" TEXT NOT NULL,
    "toAnimeId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,

    CONSTRAINT "AnimeRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeRelation_fromAnimeId_toAnimeId_relationType_key" ON "AnimeRelation"("fromAnimeId", "toAnimeId", "relationType");

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_fromAnimeId_fkey" FOREIGN KEY ("fromAnimeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_toAnimeId_fkey" FOREIGN KEY ("toAnimeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
