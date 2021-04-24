/*
  Warnings:

  - You are about to drop the column `postId` on the `Sub` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sub" DROP CONSTRAINT "Sub_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sub" DROP COLUMN "postId";

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY("postId")REFERENCES "Sub"("id") ON DELETE CASCADE ON UPDATE CASCADE;
