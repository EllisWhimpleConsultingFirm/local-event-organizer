import { Router } from 'express';
import { verifyAccessToken } from '../../../../middleware/authMiddleware.js';
import { CustomRequest } from "../../../../types/express/index.d.js";

const router = Router();

router.get('/', verifyAccessToken, async (req: CustomRequest, res) => {
    const username = req.user.username;
    if (username != null) {
        res.json({
            user: username
        });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

export default router;