import { Router } from 'express';
import { generateTokens } from '../../../../utils/auth/tokenUtils.js';
import { saveRefreshToken } from '../../../../utils/auth/tokenStore.js';

const router = Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // TODO: Implement actual user authentication
    if (username && password) {
        const { accessToken, refreshToken } = await generateTokens(username);
        await saveRefreshToken(username, refreshToken);

        res.json({
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 3600 // 1 hour
        });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

export default router;