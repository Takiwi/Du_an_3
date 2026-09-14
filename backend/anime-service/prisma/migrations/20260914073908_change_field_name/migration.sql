/*
  Warnings:

  - The `status` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Anime` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMING_SOON', 'CURRENT_SHOWING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "type" AS ENUM ('TV_SHOW', 'MOVIE', 'OVE', 'SPECIAL');

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'COMING_SOON',
DROP COLUMN "type",
ADD COLUMN     "type" "type" NOT NULL DEFAULT 'MOVIE';

-- DropEnum
DROP TYPE "STATUS";

-- DropEnum
DROP TYPE "TYPE";
