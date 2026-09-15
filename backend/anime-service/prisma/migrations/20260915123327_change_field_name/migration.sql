/*
  Warnings:

  - You are about to drop the column `view` on the `Anime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "view",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
