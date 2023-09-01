/*
  Warnings:

  - You are about to drop the `MemeTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MemeTemplate";

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "boxCount" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_id_key" ON "Template"("id");
