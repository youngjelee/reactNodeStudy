import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
// import fp from 'fastify-plugin'
import authRoute from './auth/index.js'
import meRoute from './me/index.js'

const api: FastifyPluginAsync = async (fastify) => {
  //권한
  fastify.register(authRoute, { prefix: '/auth' })
  //나의정보
  fastify.register(meRoute, { prefix: '/me' })
}

export default api
