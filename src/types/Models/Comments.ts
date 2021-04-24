import { objectType } from 'nexus'

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.model.id()
    t.model.identifier()
    t.model.body()
    t.model.author()
    t.model.authorId()
    t.model.posts()
    t.model.postId()
    t.model.createdAt()
  },
})
