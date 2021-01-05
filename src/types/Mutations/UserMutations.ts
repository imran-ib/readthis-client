import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { intArg, mutationType, nonNull, nullable, stringArg } from 'nexus'
import { getUserId, validateEmail, Hash, GenerateToken } from '../../utils'
import {
  UserInputError,
  ValidationError,
  AuthenticationError,
} from 'apollo-server-express'

export const Mutation = mutationType({
  definition(t) {
    t.crud.deleteManyUser() // TODO Delete This
    t.nullable.field('Register', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstName: nullable(stringArg()),
        lastName: nullable(stringArg()),
      },
      description: 'Create New User',
      //@ts-ignore
      resolve: async (
        _parent,
        { email, username, password, firstName, lastName },
        ctx,
      ) => {
        try {
          // if Empty field throw error
          if (
            email.trim() === '' ||
            username.trim() === '' ||
            password.trim() == ''
          )
            return new UserInputError(`Missing Required Field`)
          //Validate Email
          const ValidEmail = validateEmail(email)
          if (!ValidEmail)
            return new Error(
              `${email} is not Valid email. Please Provide a valid email. `,
            )
          // check if User Already Register
          const UserExists = await ctx.prisma.user.findFirst({
            where: {
              email,
            },
          })
          if (UserExists)
            return new Error(`User Already Register with this email`)

          //if Password is short throw Error
          if (password.length < 4) {
            return new UserInputError(`Password is Too Short`)
          }
          // Hash Password
          const hashedPassword: string = await Hash(password)
          // Create Handler
          const rhandler = 'u' + '/' + username
          // create New User
          const User = await ctx.prisma.user.create({
            data: {
              email,
              username,
              password: hashedPassword,
              rhandler,
              LastName: lastName,
              firstName: firstName,
              lastSeen: new Date().toISOString(),
            },
          })
          if (!User) return new ValidationError(`unable to Create User`)
          // create Token;
          const UAt = GenerateToken(User)
          // TODO Send Cookie
          
          return {
            UAt,
            user: User,
          }
        } catch (error) {
          return new UserInputError(error.message)
        }
      },
    })
    t.field('login', {
      type: 'AuthPayload',
      args: {
        emailOrUsername: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      //@ts-ignore
      resolve: async (_parent, { emailOrUsername, password }, ctx) => {
        try {
          // if Empty field throw error
          if (emailOrUsername.trim() === '' || password.trim() == '')
            return new UserInputError(`Missing Required Field`)
        } catch (error) {
          return new UserInputError(error.message)
        }
        const user = await ctx.prisma.user.findFirst({
          where: {
            OR: [
              {
                email: emailOrUsername,
              },
              { username: emailOrUsername },
            ],
          },
        })
        if (!user) {
          return new AuthenticationError(`No user found`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          return new AuthenticationError('Invalid password')
        }
        // create Token;
        const UAt = GenerateToken(user)
        // TODO Send Cookie
        return {
          UAt,
          user,
        }
      },
    })
  },
})
