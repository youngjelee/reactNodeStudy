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
import {swaggerUiConfig} from './config/swaggerUi.js'

const server: FastifyInstance = Fastify({logger:true})


/**swagger */
await server.register(swaggerPlugin, swaggerConfig)
await server.register(swaggerUiPlugin, swaggerUiConfig);

// fastifySwaggerUi(server)

server.register(routes)



server.listen({ port: 4000 }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }

  const address = server.server.address()
  const port = typeof address === 'string' ? address : address?.port

})