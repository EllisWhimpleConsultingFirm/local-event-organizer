import { FastifyPluginAsync } from 'fastify';

const api: FastifyPluginAsync = async (fastify) => {
    await fastify.register(import('./health'));

    // Register other API routes here
};

export default api;