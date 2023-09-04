-- AlterTable
ALTER TABLE "Meme" ADD COLUMN     "audience" TEXT NOT NULL DEFAULT 'web developers',
ADD COLUMN     "topics" TEXT NOT NULL DEFAULT 'css bugs';
