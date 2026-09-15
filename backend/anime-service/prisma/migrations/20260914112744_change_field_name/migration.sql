/*
  Warnings:

  - The `type` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('TV_SHOW', 'MOVIE', 'OVE', 'SPECIAL');

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'MOVIE';

-- DropEnum
DROP TYPE "type";
