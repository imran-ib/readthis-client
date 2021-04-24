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

export const SubMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  t.crud.deleteManySub()
  t.field('CreateSub', {
    type: 'Sub',
    args: {
      name: nonNull(stringArg()),
      title: nonNull(stringArg()),
      description: nonNull(stringArg()),
      imageUrn: nullable(stringArg()),
      bannerUrn: nullable(stringArg()),
    },
    description: 'Create new Sub',
    //@ts-ignore
    resolve: async (
      _parent,
      { name, description, imageUrn, bannerUrn, title },
      ctx,
    ) => {
      try {
        // check if there is user
        const userId = getUserId(ctx)
        if (!userId) return new Error(`You must Login first`)
        // check if name and description is not empty
        if (name.trim() === '') return new Error(`Missing Name of the Sub`)
        if (title.trim() === '') return new Error(`Missing Title of the Sub`)
        if (description.trim() === '')
          return new Error(`descriptions is required`)
        // check if sub with that name already exists
        const SubExists = await ctx.prisma.sub.findFirst({
          where: {
            name: name.toLowerCase(),
          },
        })

        if (SubExists) return new Error(`Sub Already Exists`)
        return ctx.prisma.sub.create({
          data: {
            name: name.toLowerCase(),
            title,
            description,
            bannerUrn,
            imageUrn,
            author: { connect: { id: parseInt(userId) } },
          },
        })
      } catch (error) {
        return new UserInputError(error.message)
      }
    },
  })
}
