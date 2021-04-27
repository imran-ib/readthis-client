-- CreateEnum
CREATE TYPE "LikeReactions" AS ENUM ('LIKE', 'LOVE', 'CARE', 'FUNNY', 'SAD');

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "commentId" DROP NOT NULL;
