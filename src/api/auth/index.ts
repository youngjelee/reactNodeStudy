import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import requireAuthPlugin from '../../plugins/requireAuthPlugin.js'
import UserService from '../../services/UserService.js'
import { loginSchema, registerSchema } from './schema.js'
import { AuthBody } from './types.js'
// import fp from 'fastify-plugin'

const auth: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance()

  // fastify.register(async (_fastify) => {
  //   _fastify.register(requireAuthPlugin)

  //   _fastify.get('/testme', async () => {
  //     return 'cool'
  //   })
  // })

  fastify.post<{ Body: AuthBody }>(
    '/login',
    { schema: loginSchema },
    async (request, reply) => {
      const authResult = await userService.login(request.body)

      reply.setCookie('access_token', authResult.tokens.accessToken, {
        httpOnly: true, //block javascript access to cookie
        expires: new Date(Date.now() + 1000 * 60 * 60),
        path: '/',
      })
      reply.setCookie('refesh_token', authResult.tokens.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      })

      return authResult
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
