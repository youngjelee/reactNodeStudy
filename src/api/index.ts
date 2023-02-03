
import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
// import fp from 'fastify-plugin'
import authRoute from './auth/index.js'


const api : FastifyPluginAsync = async(fastify) =>{
    fastify.register(authRoute,{prefix:'/auth'})
}
export default api