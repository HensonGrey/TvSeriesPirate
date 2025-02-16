/*
  Warnings:

  - You are about to drop the column `image_path` on the `CurrentlyWatching` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `Favourite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CurrentlyWatching" DROP COLUMN "image_path",
ADD COLUMN     "imagePath" TEXT;

-- AlterTable
ALTER TABLE "Favourite" DROP COLUMN "image_path",
ADD COLUMN     "imagePpath" TEXT;
