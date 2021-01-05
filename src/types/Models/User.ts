import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.username()
    t.model.rhandler()
    t.model.firstName()
    t.model.LastName()
    t.model.avatar()
    t.model.isActive()
    t.model.lastSeen()
    t.model.lastTyped()
    t.model.createdAt()
    t.model.updatedAt()
  },
})
