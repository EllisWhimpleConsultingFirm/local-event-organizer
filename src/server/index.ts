// src/server/index.ts

import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyStatic from '@fastify/static';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createServer() {
    const app: FastifyInstance = Fastify();
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });

    await app.register(import('@fastify/middie'));
    await app.use(vite.middlewares);

    // Serve static files
    await app.register(fastifyStatic, {
        root: resolve(__dirname, '../../dist/client/assets'),
        prefix: '/assets/',
    });

    // Register API routes
    await app.register(import('./routes/api'), { prefix: '/api' });

    // Register page routes
    await app.register(import('./routes/pages'));

    // Register not found handler
    app.register(async (fastify) => {
        fastify.setNotFoundHandler(async (request: FastifyRequest, reply: FastifyReply) => {
            const url = request.url;

            try {
                // 1. Read index.html
                let template = await fs.readFile(
                    resolve(__dirname, '../../index.html'),
                    'utf-8'
                );

                // 2. Apply Vite HTML transforms
                template = await vite.transformIndexHtml(url, template);

                // 3. Load the server entry
                const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

                // 4. Render the app HTML
                const appHtml = await render(url);

                // 5. Inject the app-rendered HTML into the template.
                const html = template.replace('<!--app-html-->', appHtml);

                // 6. Send the rendered HTML back.
                reply.type('text/html').send(html);
            } catch (e) {
                if (e instanceof Error) {
                    vite.ssrFixStacktrace(e);
                    console.error(e);
                    reply.status(500).send(e.stack);
                } else {
                    console.error('An unknown error occurred');
                    reply.status(500).send('Internal Server Error');
                }
            }
        });
    });

    const port = process.env.PORT || 3000;
    await app.listen({ port: Number(port), host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${port}`);
}

createServer();