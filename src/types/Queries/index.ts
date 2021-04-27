import { queryType } from "nexus";
import { PostQuery } from "./PostQueries";
import { UserQueries } from "./UserQueries";
import { SubQuery } from "./SubQueries";

export const Query = queryType({
  definition(t) {
    t.crud.comments();
    t.crud.comment();
    PostQuery(t);
    UserQueries(t);
    SubQuery(t);
  },
});
