/*
  Warnings:

  - You are about to drop the `AutoMemeIdeas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutoMemeIdeas" DROP CONSTRAINT "AutoMemeIdeas_userId_fkey";

-- AlterTable
ALTER TABLE "Meme" ADD COLUMN     "autoMemeIdeaId" TEXT;

-- DropTable
DROP TABLE "AutoMemeIdeas";

-- CreateTable
CREATE TABLE "AutoMemeIdea" (
    "id" TEXT NOT NULL,
    "topics" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "stopDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AutoMemeIdea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_autoMemeIdeaId_fkey" FOREIGN KEY ("autoMemeIdeaId") REFERENCES "AutoMemeIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoMemeIdea" ADD CONSTRAINT "AutoMemeIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
