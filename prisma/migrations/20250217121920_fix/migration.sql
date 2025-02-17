/*
  Warnings:

  - You are about to drop the column `title` on the `CurrentlyWatching` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favourite` table. All the data in the column will be lost.
  - Added the required column `showTitle` to the `CurrentlyWatching` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showTitle` to the `Favourite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentlyWatching" DROP COLUMN "title",
ADD COLUMN     "showTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Favourite" DROP COLUMN "title",
ADD COLUMN     "showTitle" TEXT NOT NULL;
