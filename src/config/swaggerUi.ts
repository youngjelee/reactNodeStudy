import {FastifySwaggerUiOptions} from '@fastify/swagger-ui'

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request: any, reply: any, next: () => void) {
      next()
    },
    preHandler: function (request: any, reply: any, next: () => void) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header: any) => header,
  transformSpecification: (swaggerObject: any, request: any, reply: any) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
}
// import fastifySwaggerUi from '@fastify/swagger-ui'
// import {
//   FastifyPluginCallback,
//   FastifyPluginAsync,
//   FastifyPluginOptions,
// } from 'fastify'


// const swaggerUi: FastifyPluginAsync = async(fastify)=>{
//   await fastify.register(require('@fastify/swagger-ui'), {
//     routePrefix: '/documentation',
//     uiConfig: {
//       docExpansion: 'full',
//       deepLinking: false,
//     },
//     uiHooks: {
//       onRequest: function (request: any, reply: any, next: () => void) {
//         next()
//       },
//       preHandler: function (request: any, reply: any, next: () => void) {
//         next()
//       },
//     },
//     staticCSP: true,
//     transformStaticCSP: (header: any) => header,
//     transformSpecification: (swaggerObject: any, request: any, reply: any) => {
//       return swaggerObject
//     },
//     transformSpecificationClone: true,
//   })
// }

// export default swaggerUi;
