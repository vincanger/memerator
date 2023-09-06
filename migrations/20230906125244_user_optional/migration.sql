-- DropForeignKey
ALTER TABLE "Meme" DROP CONSTRAINT "Meme_userId_fkey";

-- AlterTable
ALTER TABLE "Meme" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
