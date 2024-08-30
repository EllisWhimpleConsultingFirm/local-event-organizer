import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'OK' });
});

export default router;