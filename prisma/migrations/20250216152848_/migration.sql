/*
  Warnings:

  - You are about to drop the column `imagePpath` on the `Favourite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favourite" DROP COLUMN "imagePpath",
ADD COLUMN     "imagePath" TEXT;
