import { FastifySchema } from 'fastify'
import { appErrorSchema, createAppErrorSchema } from '../../lib/AppError.js'
import { userSchema } from '../../schema/userSchema.js'
// import { userSchema } from '../../schema/userSchema.js'

export const getMeSchema: FastifySchema = {
  //   body: userSchema,
  response: {
    200: userSchema,
    401: createAppErrorSchema(
      {
        UnAuthorizedError: {
          statusCode: 401,
          message: 'UnAuthorizedError',
          payload: {
            isExpiredToken: true,
          },
        },
      },
      {
        type: 'object',
        properties: {
          isExpiredToken: {
            type: 'boolean',
          },
        },
      },
    ),
  },
}
