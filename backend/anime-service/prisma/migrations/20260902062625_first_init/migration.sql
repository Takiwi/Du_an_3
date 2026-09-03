-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('COMING_SOON', 'CURRENT_SHOWING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('TV_SHOW', 'MOVIE', 'OVE', 'SPECIAL');

-- CreateTable
CREATE TABLE "Anime" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "STATUS" NOT NULL DEFAULT 'COMING_SOON',
    "type" "TYPE" NOT NULL DEFAULT 'MOVIE',
    "seriesId" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3),
    "seasion" TIMESTAMP(3) NOT NULL,
    "view" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeCategories" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "AnimeCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Anime" ADD CONSTRAINT "Anime_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCategories" ADD CONSTRAINT "AnimeCategories_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCategories" ADD CONSTRAINT "AnimeCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
