import { nonNull, nullable, stringArg, intArg } from "nexus";
import { getUserId } from "../../utils";

import { ObjectDefinitionBlock } from "nexus/dist/core";

const Type = {
  VOTE_POST: "VOTE_POST",
  VOTE_COMMENT: "VOTE_COMMENT",
};

export const VoteMutations = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.nonNull.field("ToggleVote", {
    type: "VotePayload",
    args: {
      slug: nullable(stringArg()),
      PostId: nullable(intArg()),
      CommentId: nullable(intArg()),
      value: nonNull(intArg()),
      VoteType: nonNull(stringArg()),
    },
    description: `Up Or Down Vote`,
    //@ts-ignore
    resolve: async (
      _parent,
      { slug, PostId, CommentId, value, VoteType },
      ctx
    ) => {
      try {
        const userId = getUserId(ctx);
        if (!userId) return new Error(`You must login first`);
        // we will send either 1 , 0 , -1 as values
        // 1  => up Vote
        // -1 => Down Vote
        // 0 => remove Vote
        // So the Value must be one of these three numbers
        if (![1, 0, -1].includes(value)) return new Error(`Invalid Input`);

        const FindPost = () => {
          return ctx.prisma.post.findFirst({
            where: { AND: [{ id: PostId! }, { slug: slug! }] },
            include: { votes: true },
          });
        };
        const FindComment = () => {
          return ctx.prisma.comment.findFirst({
            where: { id: CommentId! },
            include: { votes: true },
          });
        };

        const FindVote = (id: number) => {
          return ctx.prisma.vote.findFirst({
            where: {
              OR: [
                {
                  commentId: id,
                },
                {
                  postId: id,
                },
              ],
            },
          });
        };

        let post;
        let comment;
        let vote;

        if (VoteType === Type.VOTE_COMMENT && CommentId) {
          // ================Comment=======================//
          comment = await FindComment();
          if (!comment) return new Error(`Comment Not Found`);
          vote = await FindVote(comment.id);

          if (!vote && value === 0) {
            return new Error(`Vote Not Found`);
          } else if (!vote) {
            vote = await ctx.prisma.vote.create({
              data: {
                VoteType: "VOTE_COMMENT",
                user: { connect: { id: parseInt(userId) } },
                value,
                comment: { connect: { id: comment.id } },
              },
            });
          } else if (vote && value === 0) {
            return ctx.prisma.vote.delete({ where: { id: vote.id } });
          } else if (vote && vote.value !== value) {
            return ctx.prisma.vote.update({
              where: { id: vote.id },
              data: { value },
            });
          }
          // ================Comment=======================//
        } else if (VoteType === Type.VOTE_POST && PostId) {
          // ================Post=======================//
          post = await FindPost();

          if (!post) return new Error(`Post Not Found`);
          vote = await FindVote(post.id);

          if (!vote && value === 0) {
            return new Error(`Vote Not Found`);
          } else if (!vote) {
            vote = await ctx.prisma.vote.create({
              data: {
                VoteType: "VOTE_POST",
                user: { connect: { id: parseInt(userId) } },
                value,
                post: { connect: { id: post.id } },
              },
            });
          } else if (vote && value === 0) {
            return ctx.prisma.vote.delete({ where: { id: vote.id } });
          } else if (vote && vote.value !== value) {
            return ctx.prisma.vote.update({
              where: { id: vote.id },
              data: { value },
            });
          }
          // ================Post=======================//
        } else {
          return new Error(`Invalid Vote Type`);
        }

        if (VoteType === Type.VOTE_COMMENT) {
          return ctx.prisma.comment.findFirst({ where: { id: comment?.id } });
        } else {
          return ctx.prisma.post.findFirst({ where: { id: post?.id } });
        }
      } catch (error) {
        return new Error(error.message);
      }
    },
  });
};
