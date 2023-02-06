import { FastifySchema } from 'fastify'
import { appErrorSchema } from '../../lib/AppError.js'

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
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
      },
    },
  },
}

const authBodySchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

export const loginSchema: FastifySchema = {
  body: { authBodySchema },
  response: {
    200: authResultSchema,
  },
}

export const registerSchema: FastifySchema = {
  body: { authBodySchema },
  response: {
    200: authResultSchema,
    409: {
      ...appErrorSchema,
      example: {
        name: { type: 'string' },
        message: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
    // {
    //   description: 'Successful response',
    //   type: 'object',
    //   properties: {
    //     token: { type: 'string' },
    //   },
    //   example: {
    //     token: 'helloworld',
    //   },
    // },
  },
}
