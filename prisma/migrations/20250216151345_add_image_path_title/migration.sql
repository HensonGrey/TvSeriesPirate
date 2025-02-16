/*
  Warnings:

  - Added the required column `title` to the `CurrentlyWatching` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `showType` on the `CurrentlyWatching` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `title` to the `Favourite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentlyWatching" ADD COLUMN     "image_path" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "showType",
ADD COLUMN     "showType" "ShowType" NOT NULL;

-- AlterTable
ALTER TABLE "Favourite" ADD COLUMN     "image_path" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
