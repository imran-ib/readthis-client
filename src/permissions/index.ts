import { rule, shield } from "graphql-shield";
import { getUserId } from "../utils";

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),
};

export const permissions = shield({
  Query: {},
  Mutation: {
    CreatePost: rules.isAuthenticatedUser,
    CreateSub: rules.isAuthenticatedUser,
    CreateComment: rules.isAuthenticatedUser,
    ToggleVote: rules.isAuthenticatedUser,
  },
});
