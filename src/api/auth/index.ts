import {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyReply,
} from 'fastify'
import { AppError } from '../../lib/AppError.js'
import requireAuthPlugin from '../../plugins/requireAuthPlugin.js'
import UserService from '../../services/UserService.js'
import { loginSchema, refreshTokenSchema, registerSchema } from './schema.js'
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

      setTokenCookie(reply, {
        accessToken: authResult.tokens.accessToken,
        refreshToken: authResult.tokens.refreshToken,
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

  fastify.post<{ Body: { refreshToken?: string } }>(
    '/refresh',
    { schema: refreshTokenSchema },
    async (request, reply) => {
      const refreshToken =
        request.body.refreshToken ?? request.cookies.refresh_token ?? ''
      console.log(refreshToken)
      if (!refreshToken) {
        throw new AppError('BadRequestError')
      }
      const tokens = await userService.refreshToken(refreshToken)

      setTokenCookie(reply, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })

      return tokens
    },
  )
}

function setTokenCookie(
  reply: FastifyReply,
  tokens: { accessToken: string; refreshToken: string },
) {
  reply.setCookie('access_token', tokens.accessToken, {
    httpOnly: true, //block javascript access to cookie
    expires: new Date(Date.now() + 1000 * 60 * 60),
    path: '/',
  })
  reply.setCookie('refresh_token', tokens.refreshToken, {
    httpOnly: true, //block javascript access to cookie
    expires: new Date(Date.now() + 1000 * 60 * 60),
    path: '/',
  })
}
export default auth
