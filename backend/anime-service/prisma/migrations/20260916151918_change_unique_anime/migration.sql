/*
  Warnings:

  - A unique constraint covering the columns `[title,season,author,studio]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Anime_title_releaseDate_author_studio_key";

-- CreateIndex
CREATE UNIQUE INDEX "Anime_title_season_author_studio_key" ON "Anime"("title", "season", "author", "studio");
