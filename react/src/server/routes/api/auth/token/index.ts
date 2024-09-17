import { Router } from 'express';
import { verifyRefreshToken, generateTokens, verifyAuthorizationCode } from '../../../../utils/auth/tokenUtils.js';
import { getRefreshToken, saveRefreshToken, removeRefreshToken } from '../../../../utils/auth/tokenStore.js';
import { getAuthorizationCode, removeAuthorizationCode } from '../../../../utils/auth/codeStore.js';
import { getClient } from '../../../../utils/auth/clientStore.js';
import { verifyPKCE } from '../../../../utils/auth/pkceUtils.js';

const router = Router();

router.post('/', async (req, res) => {
    const { grant_type, refresh_token, code, redirect_uri, client_id, client_secret, code_verifier } = req.body;

    if (grant_type === 'refresh_token' && refresh_token) {
        try {
            const payload = await verifyRefreshToken(refresh_token);
            const storedRefreshToken = await getRefreshToken(payload.username);

            if (refresh_token !== storedRefreshToken) {
                throw new Error('Refresh token mismatch');
            }

            const { accessToken, refreshToken } = await generateTokens(payload.username);
            await saveRefreshToken(payload.username, refreshToken);

            res.json({
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: 3600 // 1 hour
            });
        } catch (error) {
            await removeRefreshToken(refresh_token);
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    } else if (grant_type === 'authorization_code' && code) {
        try {
            const client = await getClient(client_id);
            if (!client || (client.client_secret && client.client_secret !== client_secret)) {
                throw new Error('Invalid client');
            }

            const codeData = await getAuthorizationCode(code);
            if (!codeData || codeData.client_id !== client_id || codeData.redirect_uri !== redirect_uri) {
                throw new Error('Invalid authorization code');
            }

            if (codeData.code_challenge) {
                if (!verifyPKCE(codeData.code_challenge, codeData.code_challenge_method, code_verifier)) {
                    throw new Error('Invalid PKCE verification');
                }
            }

            await verifyAuthorizationCode(code);
            await removeAuthorizationCode(code);

            const { accessToken, refreshToken } = await generateTokens(codeData.user_id);
            await saveRefreshToken(codeData.user_id, refreshToken);

            res.json({
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: 3600 // 1 hour
            });
        } catch (error) {
            res.status(400).json({ error: 'Invalid authorization code' });
        }
    } else {
        res.status(400).json({ error: 'Invalid grant type' });
    }
});

export default router;