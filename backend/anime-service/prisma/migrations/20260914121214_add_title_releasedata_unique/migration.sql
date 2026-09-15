/*
  Warnings:

  - A unique constraint covering the columns `[title,releaseDate]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Anime_title_releaseDate_key" ON "Anime"("title", "releaseDate");
