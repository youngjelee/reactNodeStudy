import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import jwt, { decode } from 'jsonwebtoken'
import { AppError } from '../lib/AppError.js'

import { AccessTokenPayload, validateToken } from '../lib/tokens.js'

const { JsonWebTokenError } = jwt

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      username: string
    } | null
    isExpiredToken: boolean
  }
}

// define options
export interface MyPluginOptions {
  myPluginOption: string
}

// define plugin using promises
const authPluginAsync: FastifyPluginAsync<MyPluginOptions> = async (
  fastify,
  options,
) => {
  fastify.decorateRequest('user', null)
  fastify.decorateRequest('isExpiredToken', false)

  fastify.addHook('preHandler', async (request) => {
    // const { authorization } = request.headers
    // if (!authorization || !authorization.includes('Bearer')) {
    //   return
    // }

    const token =
      request.headers.authorization?.split('Bearer ')[1] ??
      request.cookies.access_token

    if (!token) return

    try {
      const decoded = await validateToken<AccessTokenPayload>(token)
      console.log('decoded ::::::::', decoded)
      request.user = {
        id: decoded.userId,
        username: decoded.username,
      }
    } catch (e: any) {
      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          request.isExpiredToken = true
        }
      }
    }
    // request.user = {
    //   id: 1,
    //   username: 'wpdud',
    // }

    console.log(' global plugin is updated')
  })
}

// export default fp(authPluginAsync, '4.12.0')

export const authPlugin = fp(authPluginAsync, {
  name: 'global-authPlugin',
})
