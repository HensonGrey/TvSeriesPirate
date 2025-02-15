-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "watch_list" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
