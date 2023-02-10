import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import UserService from '../../services/UserService.js'
import { loginSchema, registerSchema } from './schema.js'
import { AuthBody } from './types.js'
// import fp from 'fastify-plugin'

const auth: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post<{ Body: AuthBody }>(
    '/login',
    { schema: loginSchema },
    async (request) => {
      return userService.login(request.body)
    },
  )

  fastify.post<{ Body: AuthBody }>(
    '/register',
    {
      schema: registerSchema,
    },
    async (request) => {
      const authResult = await userService.register(request.body)
      return authResult
    },
  )
}
export default auth
