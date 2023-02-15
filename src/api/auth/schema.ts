import { FastifySchema } from 'fastify'
import { appErrorSchema, createAppErrorSchema } from '../../lib/AppError.js'
import { userSchema } from '../../schema/userSchema.js'

const authResultSchema = {
  type: 'object',
  properties: {
    tokens: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: userSchema,
  },
}

const authBodySchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
}

export const loginSchema: FastifySchema = {
  body: { authBodySchema },
  response: {
    200: authResultSchema,
    401: createAppErrorSchema({
      name: 'AuthenticationError',
      message: 'Invalid usernmae or password',
      statusCode: 401,
    }),
  },
}

export const registerSchema: FastifySchema = {
  body: { authBodySchema },
  response: {
    200: authResultSchema,
    409: createAppErrorSchema({
      name: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'number' },
    }),
  },
}

export const refreshTokenSchema: FastifySchema = {
  body: { type: 'object', properties: { refreshToken: { type: 'string' } } },
}
