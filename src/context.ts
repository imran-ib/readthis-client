import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
}

export function createContext(req: Context) {
  return {
    ...req,
    prisma,
  }
}
