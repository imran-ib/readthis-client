/*
  Warnings:

  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "text",
DROP COLUMN "username",
ADD COLUMN     "identifier" TEXT NOT NULL;
