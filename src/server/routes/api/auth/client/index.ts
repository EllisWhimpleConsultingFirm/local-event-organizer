import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveClient, getClient, getAllClients, updateClient, deleteClient } from '../../../../utils/auth/clientStore.js';
import { verifyAccessToken } from '../../../../middleware/authMiddleware.js';

const router = Router();

// Register a new client
router.post('/register', async (req, res) => {
    const { name, redirect_uris } = req.body;

    if (!name || !redirect_uris || !Array.isArray(redirect_uris)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const client = {
        client_id: uuidv4(),
        client_secret: uuidv4(),
        name,
        redirect_uris,
    };

    await saveClient(client);

    res.status(201).json(client);
});

// Get all clients (protected route)
router.get('/', verifyAccessToken, async (req, res) => {
    const clients = await getAllClients();
    res.json(clients);
});

// Get a specific client (protected route)
router.get('/:client_id', verifyAccessToken, async (req, res) => {
    const client = await getClient(req.params.client_id);
    if (!client) {
        return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
});

// Update a client (protected route)
router.put('/:client_id', verifyAccessToken, async (req, res) => {
    const { name, redirect_uris } = req.body;
    const updatedClient = await updateClient(req.params.client_id, { name, redirect_uris });
    if (!updatedClient) {
        return res.status(404).json({ error: 'Client not found' });
    }
    res.json(updatedClient);
});

// Delete a client (protected route)
router.delete('/:client_id', verifyAccessToken, async (req, res) => {
    const result = await deleteClient(req.params.client_id);
    if (!result) {
        return res.status(404).json({ error: 'Client not found' });
    }
    res.status(204).send();
});

export default router;