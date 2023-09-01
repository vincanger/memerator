/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Meme` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meme_url_key" ON "Meme"("url");
