import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import UserService from '../../services/UserService.js'
import { loginSchema, registerSchema } from './schema.js'
import { AuthBody } from './types.js'
// import fp from 'fastify-plugin'

const auth: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  fastify.post('/login', { schema: loginSchema }, async () => {
    return userService.login()
  })

  fastify.post<{ Body: AuthBody }>(
    '/register',
    {
      schema: registerSchema,
    },
    async (fastify) => {
      const authResult = await userService.register(fastify.body)
      return authResult
    },
  )
}
export default auth
