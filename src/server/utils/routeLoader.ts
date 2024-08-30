// src/server/utils/routeLoader.ts

import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadRoutes(directory: string, baseRoute: string = ''): Promise<Router> {
    const router = Router();
    const routeFiles = fs.readdirSync(directory);

    for (const file of routeFiles) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const subRouter = await loadRoutes(fullPath, path.join(baseRoute, file));
            router.use(`/${file}`, subRouter);
        } else if (file === 'index.ts' || file === 'index.js') {
            const routeModule = await import(pathToFileURL(fullPath).href);
            const route = routeModule.default;
            router.use('/', route);  // Mount at root of current router
            console.log(`Mounted route from ${file} at ${baseRoute}`);
        }
    }

    return router;
}

export default loadRoutes;