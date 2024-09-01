import { Router } from 'express';
import { generateAuthorizationCode } from '../../../../utils/auth/tokenUtils.js';
import { getClient } from '../../../../utils/auth/clientStore.js';
import { saveAuthorizationCode } from '../../../../utils/auth/codeStore.js';

const router = Router();

router.get('/', async (req, res) => {
    const { client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method } = req.query;

    if (!client_id || !redirect_uri || response_type !== 'code') {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const client = await getClient(client_id as string);
    if (!client || !client.redirect_uris.includes(redirect_uri as string)) {
        return res.status(400).json({ error: 'Invalid client or redirect URI' });
    }

    // TODO: Authenticate the user here. For now, we'll assume the user is authenticated.
    const user_id = 'example_user_id';

    const code = await generateAuthorizationCode();
    await saveAuthorizationCode(code, {
        client_id: client_id as string,
        user_id,
        scope: scope as string,
        code_challenge: code_challenge as string,
        code_challenge_method: code_challenge_method as string,
    });

    const redirectUrl = new URL(redirect_uri as string);
    redirectUrl.searchParams.append('code', code);
    if (state) {
        redirectUrl.searchParams.append('state', state as string);
    }

    res.redirect(redirectUrl.toString());
});

export default router;