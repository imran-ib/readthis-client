import { objectType } from "nexus";

export const VotePayload = objectType({
  name: "VotePayload",
  definition(t) {
    t.nullable.field("post", { type: "Post" });
    t.nullable.field("comment", { type: "Comment" });
  },
});
