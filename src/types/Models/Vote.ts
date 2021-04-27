import { objectType } from "nexus";

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.model.id();
    t.model.VoteType();
    t.model.user();
    t.model.userId();
    t.model.post();
    t.model.postId();
    t.model.comment();
    t.model.commentId();
    t.model.value();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
