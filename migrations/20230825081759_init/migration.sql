-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meme" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "boxCount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "memeIdeaId" TEXT NOT NULL,

    CONSTRAINT "Meme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemeIdea" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MemeIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemeTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "boxCount" INTEGER NOT NULL,

    CONSTRAINT "MemeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "MemeTemplate_id_key" ON "MemeTemplate"("id");

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meme" ADD CONSTRAINT "Meme_memeIdeaId_fkey" FOREIGN KEY ("memeIdeaId") REFERENCES "MemeIdea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemeIdea" ADD CONSTRAINT "MemeIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
