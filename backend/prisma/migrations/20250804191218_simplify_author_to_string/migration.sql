/*
  Warnings:

  - You are about to drop the column `authorId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `customAuthorName` on the `BlogPost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_authorId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "authorId",
DROP COLUMN "customAuthorName",
ADD COLUMN     "authorName" TEXT;
