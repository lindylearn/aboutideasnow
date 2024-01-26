-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('INDIVIDUAL_SITE', 'DIRECTORY');

-- AlterTable
ALTER TABLE "ScrapeState" ADD COLUMN     "domainType" "DomainType" NOT NULL DEFAULT 'INDIVIDUAL_SITE';
