import { FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        return { status: 'OK' };
    });
};

export default health;