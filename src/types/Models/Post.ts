import { objectType } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.body()
    t.model.authorId()
    t.model.author()
    t.model.comments()
    t.model.identifier()
    t.model.image()
    t.model.linkToSub({
      resolve: (root, args, ctx, info, originalResolve) => {
        // Generate the link
        return `/r/${root.subName}/${root.identifier}/${root.slug}`
      },
    })
    t.model.slug()
    t.model.sub()
    t.model.subName()
    t.model.title()
    t.model.updatedAt()
    t.model.createdAt()
  },
})
