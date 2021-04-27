import { objectType } from "nexus";
import { getUserId } from "../../utils";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.body();
    t.model.authorId();
    t.model.author();
    t.model.comments();
    t.model.identifier();
    t.model.image();
    t.model.linkToSub({
      //@ts-ignore
      resolve: (root, args, ctx, info, originalResolve) => {
        // Generate the link
        return `/r/${root.subName}/${root.identifier}/${root.slug}`;
      },
    });
    t.model.slug();
    t.model.sub();
    t.model.subName();
    t.model.title();
    t.model.updatedAt();
    t.model.createdAt();
    t.model.postVoteCount({
      //@ts-ignore
      resolve: async (root, _args, ctx, _info, _originalResolve) => {
        const Count = await ctx.prisma.vote.aggregate({
          where: {
            postId: root?.id,
          },
          count: true,
        });
        return Object.values(Count)[0];
      },
    });
    t.model.postCommentsCount({
      //@ts-ignore
      resolve: async (root, _args, ctx, _info, _originalResolve) => {
        const Count = await ctx.prisma.comment.aggregate({
          where: {
            postId: root?.id,
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
        const post = root;
        const Votes = await ctx.prisma.vote.findFirst({
          where: {
            //@ts-ignore
            AND: [{ postId: post.id }, { userId: parseInt(userId) }],
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
  },
});
