import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

import { AccessTokenPayload, validateToken } from '../lib/tokens.js'

const { JsonWebTokenError } = jwt

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      username: string
    } | null
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

  fastify.addHook('preHandler', async (request) => {
    console.log('==============>', request.headers.authorization)
    const { authorization } = request.headers
    if (!authorization || !authorization.includes('Bearer')) {
      return
    }

    const token = authorization.split('Bearer ')[1]
    try {
      const decoded = await validateToken<AccessTokenPayload>(token)
      console.log('decoded ::::::::', decoded)
    } catch (e: any) {
      // console.log('e.name ===> ', e.name)
      // console.log('e.message', e.message)

      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          //todo : handle token expired
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
