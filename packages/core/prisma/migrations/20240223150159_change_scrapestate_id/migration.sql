/*
  Warnings:

  - The primary key for the `ScrapeState` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ScrapeState" DROP CONSTRAINT "ScrapeState_pkey",
ALTER COLUMN "type" DROP DEFAULT,
ADD CONSTRAINT "ScrapeState_pkey" PRIMARY KEY ("domain", "type");
