import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import { AppError } from '../../lib/AppError.js'
import { getMeSchema } from './schema.js'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{}>('/', { schema: getMeSchema }, async (request) => {
    if (!request.user) {
      throw new AppError('UnAuthorizedError')
    }
    console.log('request.user', request.user)
    return request.user
  })
}
export default meRoute
