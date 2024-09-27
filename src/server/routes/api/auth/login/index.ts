import { Router } from 'express';
import { userStore } from '../../../../utils/auth/userStore.js';

const router = Router();

router.get('/', (req, res) => {
    const { client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.query;

    res.render('login', {
        client_id,
        redirect_uri,
        state,
        code_challenge,
        code_challenge_method
    });
});

router.post('/', async (req, res) => {
    const { username, password, client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.body;

    const user = await userStore.validateCredentials(username, password);

    if (!user) {
        return res.render('login', {
            error: 'Invalid credentials',
            client_id,
            redirect_uri,
            state,
            code_challenge,
            code_challenge_method
        });
    }

    // Redirect to the authorize endpoint with user information
    const authorizeUrl = new URL(`${req.protocol}://${req.get('host')}/api/auth/authorize`);
    authorizeUrl.searchParams.append('client_id', client_id as string);
    authorizeUrl.searchParams.append('redirect_uri', redirect_uri as string);
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append('state', state as string);
    authorizeUrl.searchParams.append('code_challenge', code_challenge as string);
    authorizeUrl.searchParams.append('code_challenge_method', code_challenge_method as string);
    authorizeUrl.searchParams.append('user_id', user.id);

    res.redirect(authorizeUrl.toString());
});

export default router;