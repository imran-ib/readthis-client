-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('VOTE_POST', 'VOTE_COMMENT');

-- CreateTable
CREATE TABLE "Vote" (
"id" SERIAL,
    "VoteType" "VoteType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post.title_id_index" ON "Post"("title", "id");

-- CreateIndex
CREATE INDEX "Sub.name_index" ON "Sub"("name");

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("postId")REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("commentId")REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
