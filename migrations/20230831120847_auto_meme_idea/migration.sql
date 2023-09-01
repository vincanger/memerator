-- CreateTable
CREATE TABLE "AutoMemeIdeas" (
    "id" SERIAL NOT NULL,
    "topics" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "stopDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AutoMemeIdeas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutoMemeIdeas" ADD CONSTRAINT "AutoMemeIdeas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
