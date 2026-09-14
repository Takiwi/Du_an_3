/*
  Warnings:

  - The primary key for the `AnimeCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AnimeCategories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnimeCategories" DROP CONSTRAINT "AnimeCategories_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AnimeCategories_pkey" PRIMARY KEY ("animeId", "categoryId");
