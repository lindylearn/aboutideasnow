/*
  Warnings:

  - You are about to drop the column `url` on the `ScrapeState` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PostType" ADD VALUE 'ABOUT';

-- AlterTable
ALTER TABLE "ScrapeState" DROP COLUMN "url";
