/*
  Warnings:

  - You are about to drop the column `boxCount` on the `Meme` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Meme` table. All the data in the column will be lost.
  - You are about to drop the column `memeIdeaId` on the `Meme` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Meme` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Meme` table. All the data in the column will be lost.
  - You are about to drop the `MemeIdea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `text0` to the `Meme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text1` to the `Meme` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meme" DROP CONSTRAINT "Meme_memeIdeaId_fkey";

-- DropForeignKey
ALTER TABLE "MemeIdea" DROP CONSTRAINT "MemeIdea_userId_fkey";

-- AlterTable
ALTER TABLE "Meme" DROP COLUMN "boxCount",
DROP COLUMN "height",
DROP COLUMN "memeIdeaId",
DROP COLUMN "name",
DROP COLUMN "width",
ADD COLUMN     "text0" TEXT NOT NULL,
ADD COLUMN     "text1" TEXT NOT NULL;

-- DropTable
DROP TABLE "MemeIdea";

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
