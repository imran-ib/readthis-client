import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { intArg, mutationType, nonNull, nullable, stringArg } from 'nexus'
import {
  getUserId,
  validateEmail,
  Hash,
  GenerateToken,
  makeId,
  slugify,
} from '../../utils'
import {
  UserInputError,
  ValidationError,
  AuthenticationError,
} from 'apollo-server-express'
import * as cookie from 'cookie'
import { serialize } from 'cookie'
import { ObjectDefinitionBlock } from 'nexus/dist/core'

export const CommentsMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  t.field('CreateComment', {
    type: 'Comment',
    args: {
      slug: nonNull(stringArg()),
      body: nonNull(stringArg()),
      identifier: nonNull(stringArg()),
    },
    description: `Create new comment`,
    //@ts-ignore
    resolve: async (_parent, { slug, identifier, body }, ctx) => {
      try {
        const userId = getUserId(ctx)
        if (!userId) return new Error(`You must login first`)
        //get the post
        const Post = await ctx.prisma.post.findFirst({
          where: { AND: [{ slug }, { identifier }] },
        })
        if (!Post) return new Error(`Post not found`)

        const Identifier = makeId(8)
        return ctx.prisma.comment.create({
          data: {
            author: { connect: { id: parseInt(userId) } },
            posts: { connect: { id: Post.id } },
            body,
            identifier: Identifier,
          },
        })
      } catch (error) {
        return new UserInputError(`Unable to create comment`)
      }
    },
  })
}
