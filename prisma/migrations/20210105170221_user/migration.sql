/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[username]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - The migration will add a unique constraint covering the columns `[rhandler]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rhandler` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "rhandler" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "LastName" TEXT,
ADD COLUMN     "avatar" TEXT DEFAULT E'https://res.cloudinary.com/iib-webdevs/image/upload/v1601031013/DontDeleteMe/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg',
ADD COLUMN     "OneTimePassword" INTEGER,
ADD COLUMN     "PasswordResetTokenExpiry" DECIMAL(65,30),
ADD COLUMN     "PasswordResetToken" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastTyped" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.rhandler_unique" ON "User"("rhandler");
