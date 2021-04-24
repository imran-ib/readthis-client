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

export const PostMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  t.field('CreatePost', {
    type: 'Post',
    args: {
      title: nonNull(stringArg()),
      sub: nonNull(stringArg()),
      body: nullable(stringArg()),
      image: nullable(stringArg()),
    },
    description: 'Create new Post',
    //@ts-ignore
    resolve: async (_parent, { title, sub, body, image }, ctx) => {
      try {
        // check if user is logged in (this is extra step.)
        const userId = getUserId(ctx)
        if (!userId)
          return new AuthenticationError(
            `You are not logged in. Please login before continuing!`,
          )
        const identifier = makeId(7)
        const slug = slugify(title)

        // check if sub exists
        const Sub = await ctx.prisma.sub.findFirst({
          where: { name: sub.toLowerCase() },
        })
        if (!Sub) return new Error(`Sub Not found.`)
        // create Post
        const Post = await ctx.prisma.post.create({
          data: {
            author: { connect: { id: parseInt(userId) } },
            identifier,
            slug,
            sub: { connect: { name: sub.toLowerCase() } },
            subName: sub.toLowerCase(),
            title,
            body,
            image,
          },
        })
        if (!Post) return new UserInputError(`Post Cannot be created.`)
        return Post
        // check if title and sub is empty
      } catch (error) {
        return new Error(error.message)
      }
    },
  })
}
