/*
  Warnings:

  - A unique constraint covering the columns `[title,releaseDate,author,studio]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Anime_title_releaseDate_key";

-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "author" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "studio" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Anime_title_releaseDate_author_studio_key" ON "Anime"("title", "releaseDate", "author", "studio");
