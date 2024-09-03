import { Router } from 'express';
import { generateAuthorizationCode } from '../../../../utils/auth/tokenUtils.js';
import { getClient } from '../../../../utils/auth/clientStore.js';
import { saveAuthorizationCode } from '../../../../utils/auth/codeStore.js';
import {userStore} from "../../../../utils/auth/userStore.js";

const router = Router();

router.get('/', async (req, res) => {
    const { client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method, user_id } = req.query;

    if (!client_id || !redirect_uri || response_type !== 'code' || !user_id) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const client = await getClient(client_id as string);
    if (!client || !client.redirect_uris.includes(redirect_uri as string)) {
        return res.status(400).json({ error: 'Invalid client or redirect URI' });
    }

    const user = await userStore.getUserById(user_id as string);
    if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
    }

    const code = await generateAuthorizationCode();
    await saveAuthorizationCode(code, {
        client_id: client_id as string,
        user_id: user.id,
        scope: scope as string || 'read write',
        code_challenge: code_challenge as string,
        code_challenge_method: code_challenge_method as string,
        redirect_uri
    });

    const redirectUrl = new URL(redirect_uri as string);
    redirectUrl.searchParams.append('code', code);
    if (state) {
        redirectUrl.searchParams.append('state', state as string);
    }

    res.redirect(redirectUrl.toString());
});

export default router;