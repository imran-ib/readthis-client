import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { intArg, mutationType, nonNull, nullable, stringArg } from 'nexus'
import { getUserId, validateEmail, Hash, GenerateToken } from '../../utils'
import {
  UserInputError,
  ValidationError,
  AuthenticationError,
} from 'apollo-server-express'
import * as cookie from 'cookie'
import { serialize } from 'cookie'
import { ObjectDefinitionBlock } from 'nexus/dist/core'

export const UserMutations = (t: ObjectDefinitionBlock<'Mutation'>) => {
  // t.crud.deleteManyUser() // TODO Delete This
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
        if (email.trim() === '') {
          return new UserInputError(`Email is required`)
        }
        if (username.trim() === '') {
          return new UserInputError(`Username is required`)
        }
        if (password.trim() === '') {
          return new UserInputError(`Password is required`)
        }

        //Validate Email
        const ValidEmail = validateEmail(email)
        if (!ValidEmail)
          return new Error(
            `${email} is not Valid email. Please provide a valid email. `,
          )
        // check if User Already Register
        const UserExists = await ctx.prisma.user.findFirst({
          where: {
            email,
          },
        })
        if (UserExists)
          return new Error(`User already registered with this email`)

        //if Password is short throw Error
        if (password.length < 4) {
          return new UserInputError(`Password is too short`)
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
        if (!User) return new ValidationError(`unable to create user`)
        // create Token;
        const UAt = GenerateToken(User)
        // set cookie
        ctx.res.set(
          'Set-Cookie',
          serialize('UAt', UAt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // sever day's
            //TODO Check if this is correct(7days)
            maxAge: 3600 * 24 * 7,
            path: '/',
          }),
        )

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

      ctx.res.set(
        'Set-Cookie',
        serialize('UAt', UAt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          // sever day's
          //TODO Check if this is correct(7days)
          maxAge: 3600 * 24 * 7,
          path: '/',
        }),
      )
      return {
        UAt,
        user,
      }
    },
  })
  t.field('logout', {
    type: 'String',
    description: 'Remove cookie from header',
    //@ts-ignore
    resolve: (_, __, ctx) => {
      ctx.res.set(
        'Set-Cookie',
        serialize('UAt', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: new Date(0),
          path: '/',
        }),
      )
      return `Success! You are logged out`
    },
  })
}
