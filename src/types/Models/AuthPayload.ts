import { objectType } from "nexus";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("UAt");
    t.field("user", { type: "User" });
  },
});
