import Fastify from 'fastify';
const server = Fastify({});
const opts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
server.get('/ping', opts, (request, reply) => {
    reply.send({ pong: 'it worked!' });
});
server.listen({ port: 4000 }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;
});
