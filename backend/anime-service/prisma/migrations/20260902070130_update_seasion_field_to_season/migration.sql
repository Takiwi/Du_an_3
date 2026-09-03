/*
  Warnings:

  - You are about to drop the column `seasion` on the `Anime` table. All the data in the column will be lost.
  - Added the required column `season` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "seasion",
ADD COLUMN     "season" TIMESTAMP(3) NOT NULL;
