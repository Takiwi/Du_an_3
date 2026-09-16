/*
  Warnings:

  - Changed the type of `season` on the `Anime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Season" AS ENUM ('Spring', 'Summer', 'Fall', 'Winter');

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "season",
ADD COLUMN     "season" "Season" NOT NULL;
