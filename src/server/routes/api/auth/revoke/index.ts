import { Router } from 'express';
import { revokeToken } from '../../../../utils/auth/tokenStore.js';

const router = Router();

router.post('/', async (req, res) => {
    const { token, token_type_hint } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    await revokeToken(token, token_type_hint);

    // The response for successful and unsuccessful revocation requests is the same
    // to avoid leaking information about valid tokens
    res.status(200).send();
});

export default router;