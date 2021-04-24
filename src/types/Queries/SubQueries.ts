import { intArg, nullable, queryType, stringArg } from 'nexus'
import { getUserId } from '../../utils'

import { AuthenticationError } from 'apollo-server-express'
import { ObjectDefinitionBlock } from 'nexus/dist/core'

export const SubQuery = (t: ObjectDefinitionBlock<'Query'>) => {
  t.crud.subs()
}
