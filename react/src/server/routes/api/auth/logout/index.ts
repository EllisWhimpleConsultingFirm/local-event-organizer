import { Router } from 'express';
import { removeRefreshToken } from '../../../../utils/auth/tokenStore.js';
import { verifyAccessToken } from '../../../../middleware/authMiddleware.js';
import { CustomRequest } from "../../../../types/express/index.d.js";

const router = Router();

router.post('/', verifyAccessToken, async (req: CustomRequest, res) => {
    const username = req.user.username;
    await removeRefreshToken(username);
    res.json({ message: 'Logged out successfully' });
});

export default router;