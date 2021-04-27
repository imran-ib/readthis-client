-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "commentVoteCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postVoteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "postCommentsCount" INTEGER NOT NULL DEFAULT 0;
