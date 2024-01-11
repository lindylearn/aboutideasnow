/*
  Warnings:

  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('NOW', 'IDEAS');

-- CreateEnum
CREATE TYPE "ScrapeStatus" AS ENUM ('UNAVAILABLE', 'NO_CONTENT', 'SCRAPED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "PostType" NOT NULL;

-- CreateTable
CREATE TABLE "ScrapeState" (
    "domain" TEXT NOT NULL,
    "status" "ScrapeStatus" NOT NULL,
    "scapedAt" TIMESTAMP(3),

    CONSTRAINT "ScrapeState_pkey" PRIMARY KEY ("domain")
);
