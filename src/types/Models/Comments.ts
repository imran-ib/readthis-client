import { objectType } from "nexus";
import { getUserId } from "../../utils";

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.model.id();
    t.model.identifier();
    t.model.body();
    t.model.author();
    t.model.authorId();
    t.model.posts();
    t.model.postId();
    t.model.commentVoteCount({
      //@ts-ignore
      resolve: async (root, _args, ctx, _info, _originalResolve) => {
        const Count = await ctx.prisma.vote.aggregate({
          where: {
            commentId: root?.id,
          },
          count: true,
        });
        return Object.values(Count)[0];
      },
    });
    t.model.userVote({
      //@ts-ignore
      resolve: async (root, _args, ctx, _info, _originalResolve) => {
        const userId = getUserId(ctx);
        const comment = root;
        const Votes = await ctx.prisma.vote.findFirst({
          where: {
            //@ts-ignore
            AND: [{ commentId: comment.id }, { userId: parseInt(userId) }],
          },
        });
        //@ts-ignore
        if (Votes?.userId === parseInt(userId)) {
          return Votes.value;
        } else {
          return 0;
        }
      },
    });

    t.model.createdAt();
  },
});
