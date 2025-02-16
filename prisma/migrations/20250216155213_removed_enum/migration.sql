/*
  Warnings:

  - Changed the type of `showType` on the `CurrentlyWatching` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `showType` on the `Favourite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CurrentlyWatching" DROP COLUMN "showType",
ADD COLUMN     "showType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Favourite" DROP COLUMN "showType",
ADD COLUMN     "showType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ShowType";
