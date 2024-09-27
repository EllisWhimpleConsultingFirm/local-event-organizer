import { Response, NextFunction } from 'express';
import { getAccessToken } from '../utils/auth/tokenUtils.js';
import { CustomRequest } from '../types/express/index.d.js';

export async function verifyAccessToken(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const user = await getAccessToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
}