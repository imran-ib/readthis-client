import { intArg, nullable, queryType, stringArg } from 'nexus'
import { getUserId } from '../../utils'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { nonNull, ObjectDefinitionBlock } from 'nexus/dist/core'

export const PostQuery = (t: ObjectDefinitionBlock<'Query'>) => {
  t.crud.posts({
    ordering: true,
    filtering: true,
    pagination: true,
  })
  t.field('GetOnePost', {
    type: 'Post',
    args: {
      identifier: nonNull(stringArg()),
      slug: nonNull(stringArg()),
    },
    description: 'Get Single Post',
    //@ts-ignore
    resolve: async (_parent, { identifier, slug }, ctx) => {
      return ctx.prisma.post.findFirst({
        where: { AND: [{ identifier }, { slug }] },
      })
    },
  })
}
