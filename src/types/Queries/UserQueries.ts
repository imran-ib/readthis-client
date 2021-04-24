import { intArg, nullable, queryType, stringArg } from 'nexus'
import { getUserId } from '../../utils'

import { AuthenticationError } from 'apollo-server-express'
import { ObjectDefinitionBlock } from 'nexus/dist/core'

export const UserQueries = (t: ObjectDefinitionBlock<'Query'>) => {
  t.crud.users()
  t.nullable.field('CurrentUser', {
    type: 'User',
    description:
      'Returns back Current User if there is any otherwise returns null',

    //@ts-ignore
    resolve: async (parent, args, ctx) => {
      try {
        const userId = getUserId(ctx)
        if (!userId) return null
        const CurrentUser = await ctx.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
        return CurrentUser
      } catch (error) {
        return new AuthenticationError(error.message)
      }
    },
  })
}
