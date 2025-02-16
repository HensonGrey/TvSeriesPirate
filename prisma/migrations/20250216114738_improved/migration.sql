/*
  Warnings:

  - You are about to drop the column `watch_list` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShowType" AS ENUM ('TV', 'MOVIE', 'ANIME');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "watch_list";

-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" INTEGER NOT NULL,
    "showType" "ShowType" NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentlyWatching" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" INTEGER NOT NULL,
    "showType" TEXT NOT NULL,
    "seasonNum" INTEGER,
    "episodeNum" INTEGER,

    CONSTRAINT "CurrentlyWatching_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentlyWatching" ADD CONSTRAINT "CurrentlyWatching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
