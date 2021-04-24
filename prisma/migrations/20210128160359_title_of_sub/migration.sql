/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[title]` on the table `Sub`. If there are existing duplicate values, the migration will fail.
  - Added the required column `title` to the `Sub` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sub" ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sub.title_unique" ON "Sub"("title");
