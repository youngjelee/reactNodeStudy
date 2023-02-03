import { FastifyPluginCallback, FastifyPluginAsync } from 'fastify'
import UserService from '../../services/UserService.js';
// import fp from 'fastify-plugin'

const auth: FastifyPluginAsync = async (fastify) => {
 
 const userService = UserService.getInstance();
 
  fastify.get('/login', async () => {
    return userService.login();
  })
  fastify.get('/register', async () => {
    return userService.register()
  })
}
export default auth
