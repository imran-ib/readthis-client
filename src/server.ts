import { config } from 'dotenv'
config()
import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createContext } from './context'
import { schema } from './schema'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
const app = express()

const PORT = process.env.PORT || 4000

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

const server = new ApolloServer({
  schema,
  context: createContext,
})
server.applyMiddleware({ app, cors: corsOptions })
app.use(cookieParser())
app.use(morgan('dev'))

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
