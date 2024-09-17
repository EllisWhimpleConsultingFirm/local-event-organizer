import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

router.get('/:id', (req, res) => {
    res.json({ user: { id: req.params.id, name: 'Sample User' } });
});

export default router;