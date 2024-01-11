-- CreateTable
CREATE TABLE "Post" (
    "domain" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "authorName" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("domain")
);
