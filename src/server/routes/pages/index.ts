import { FastifyPluginAsync } from 'fastify';
import fs from 'fs/promises';
import { resolve } from 'path';

const pages: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        return renderPage(fastify, 'Home', request.url);
    });

    fastify.get('/about', async (request, reply) => {
        return renderPage(fastify, 'About', request.url);
    });

    // Add more page routes as needed
};

async function renderPage(fastify: any, componentName: string, url: string) {
    const vite = fastify.vite;

    let template = await fs.readFile(
        resolve(__dirname, '../../../../index.html'),
        'utf-8'
    );

    template = await vite.transformIndexHtml(url, template);

    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

    const appHtml = await render(url, componentName);

    const html = template.replace('<!--app-html-->', appHtml);

    return html;
}

export default pages;