import { FastifyPluginCallback, FastifyPluginAsync ,FastifyPluginOptions} from 'fastify'
import api from '../api/index.js'

const routes: FastifyPluginAsync = async(fastify)=>{
    fastify.register(api,{prefix:'/api'})
}
export default routes