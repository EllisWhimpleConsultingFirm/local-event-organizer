// src/server/index.ts

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import loadRoutes from './utils/routeLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
    const app = express();
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    // Serve static files
    app.use('/assets', express.static(path.join(__dirname, '../../dist/client/assets')));

    // Dynamically load API routes
    const apiRoutes = await loadRoutes(path.join(__dirname, 'routes', 'api'));

    // Add a debugging middleware for API routes
    app.use('/api', (req, res, next) => {
        console.log(`API request received: ${req.method} ${req.originalUrl}`);
        next();
    }, apiRoutes);

    // Catch-all route for the React app
    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        console.log(`Handling React app route: ${url}`);

        // Skip SSR for API routes
        if (url.startsWith('/api')) {
            console.log(`Skipping SSR for API route: ${url}`);
            return next();
        }

        try {
            // 1. Read index.html
            let template = await fs.readFile(
                path.join(__dirname, '../../index.html'),
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
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            next(e);
        }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

createServer();