import { applyMiddleware } from 'graphql-middleware'
import { connectionPlugin, makeSchema } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { permissions } from './permissions'
import * as types from './types'
import { Context } from './context'

export const schema = applyMiddleware(
  makeSchema({
    types,
    plugins: [
      nexusPrisma({
        experimentalCRUD: true,
        prismaClient: (ctx: Context) => ctx.prisma,
      }),
      connectionPlugin(),
    ],
    outputs: {
      schema: __dirname + '/../schema.graphql',
      typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
      module: require.resolve('./context'),
      alias: 'Context',
      export: 'Context',
    },
    sourceTypes: {
      modules: [
        {
          module: '@prisma/client',
          alias: 'client',
        },
      ],
    },
  }),
  permissions,
)
