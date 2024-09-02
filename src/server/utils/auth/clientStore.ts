// In a real application, you'd use a database for this
const clients: { [key: string]: any } = {};
clients['your_client_id'] = {
    name: 'SSR APP',
    redirect_uris: ['http://localhost:3000/login']
}

export async function saveClient(client: any) {
    clients[client.client_id] = client;
}

export async function getClient(clientId: string) {
    return clients[clientId];
}

export async function getAllClients() {
    return Object.values(clients);
}

export async function updateClient(clientId: string, updates: any) {
    if (clients[clientId]) {
        clients[clientId] = { ...clients[clientId], ...updates };
        return clients[clientId];
    }
    return null;
}

export async function deleteClient(clientId: string) {
    if (clients[clientId]) {
        delete clients[clientId];
        return true;
    }
    return false;
}
