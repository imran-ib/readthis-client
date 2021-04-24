import { objectType } from 'nexus'

export const Sub = objectType({
  name: 'Sub',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.title()
    t.model.description()
    t.model.imageUrn()
    t.model.bannerUrn()
    t.model.posts()
    t.model.authorId()
  },
})
