/*
  Warnings:

  - Made the column `updatedAt` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT '1970-01-01',
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ScrapeState" ADD COLUMN     "url" TEXT;
