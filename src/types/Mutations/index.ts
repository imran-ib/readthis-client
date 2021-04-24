import { mutationType } from 'nexus'
import { UserMutations } from './UserMutations'
import { PostMutations } from './PostMutations'
import { SubMutations } from './SubMutations'
import { CommentsMutations } from './CommentsMutations'

export const Mutation = mutationType({
  definition(t) {
    UserMutations(t)
    PostMutations(t)
    SubMutations(t)
    CommentsMutations(t)
  },
})
