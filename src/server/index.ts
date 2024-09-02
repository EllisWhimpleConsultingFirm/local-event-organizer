import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import loadRoutes from './utils/routeLoader.js';
import { getPublicKey } from "./utils/auth/tokenUtils.js";

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

    // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(express.urlencoded({ extended: true }));

    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());

    app.get('/.well-known/openid-configuration', (req, res) => {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
            issuer: baseUrl,
            authorization_endpoint: `${baseUrl}/api/auth/authorize`,
            token_endpoint: `${baseUrl}/api/auth/token`,
            jwks_uri: `${baseUrl}/api/auth/.well-known/jwks.json`,
            response_types_supported: ['code', 'token'],
            grant_types_supported: ['authorization_code', 'refresh_token'],
            token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
        });
    });

    app.get('/jwks.json', (req, res) => {
        const publicKey = getPublicKey();
        // Convert PEM to JWK (this is a simplified version, you might want to use a library for this)
        res.json({
            keys: [
                {
                    kty: 'RSA',
                    use: 'sig',
                    kid: '1', // Key ID
                    alg: 'RS256',
                    n: publicKey, // This should be the modulus of the public key
                    e: 'AQAB', // This should be the exponent of the public key
                },
            ],
        });
    });

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