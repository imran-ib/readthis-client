import { verify } from 'jsonwebtoken'
import { Context } from './context'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import { User } from '@prisma/client'

const JWT_SECRET = process.env.APP_SECRET!

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, JWT_SECRET) as Token
    return verifiedToken && verifiedToken.userId
  }
}

// Validate Email
export function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Bcrypt
export const Hash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const ComparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

// Crypto
export function resetPasswordToken() {
  return crypto.randomBytes(64).toString('hex')
}
export function validateEmailToken() {
  return crypto.randomBytes(64).toString('hex')
}

// Jsonwebtoken
export const GenerateToken = (user: User) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
    mutatePayload: true,
    subject: 'Auth Token',
    header: { lastSeen: new Date().toISOString() },
    issuer: `readthis.com`,
    audience: 'read this Users',
    algorithm: 'HS256',
  })
}
