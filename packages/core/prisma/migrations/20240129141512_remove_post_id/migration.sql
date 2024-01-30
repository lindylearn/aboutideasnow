/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorName` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_url_key";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "authorName",
DROP COLUMN "id",
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("url");
