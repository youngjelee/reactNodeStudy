import Fastify, {
  FastifyInstance,
  RouteShorthandOptions,
  onRequestHookHandler,
} from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import routes from './routes/index.js'
import swaggerPlugin from '@fastify/swagger'

import swaggerUiPlugin from '@fastify/swagger-ui'

import { swaggerConfig } from './config/swagger.js'
import { swaggerUiConfig } from './config/swaggerUi.js'
import db from './lib/db.js'
import { AppError } from './lib/AppError.js'
import 'dotenv/config'
import { authPlugin } from './plugins/authPlugin.js'
import fastifyCookie from '@fastify/cookie'

const server: FastifyInstance = Fastify({ logger: true })

/**swagger */
await server.register(swaggerPlugin, swaggerConfig)
await server.register(swaggerUiPlugin, swaggerUiConfig)
// swagger fastifySwaggerUi(server)

//errorHandler
server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode ?? 500

  if (error instanceof AppError) {
    reply.send({
      name: error.name,
      statusCode: error.statusCode,
      message: error.message,
      payload: error.payload,
    })
  }
  return error
})

server.register(fastifyCookie)

server.register(authPlugin)
server.register(routes)

server.listen({ port: 4000 }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }

  const address = server.server.address()
  const port = typeof address === 'string' ? address : address?.port
})
