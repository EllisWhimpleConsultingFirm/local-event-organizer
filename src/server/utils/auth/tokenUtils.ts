// File: src/server/utils/tokenUtils.ts
import jwt from 'jsonwebtoken';
import { generateKeyPair } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

let privateKey: string;
let publicKey: string;

// Generate RSA key pair
generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
}, (err, publicK, privateK) => {
    if (err) throw err;
    publicKey = publicK;
    privateKey = privateK;
});

export function getPublicKey() {
    return publicKey;
}

interface TokenPayload {
    username: string;
    // Add any other properties that should be in your token payload
}

export async function generateTokens(username: string) {
    const accessToken = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
    const refreshToken = jwt.sign({ username }, privateKey, { algorithm: 'RS256', expiresIn: '7d' });
    return { accessToken, refreshToken };
}

// TODO rename this fucntion????
export async function getAccessToken(token: string): Promise<TokenPayload> {
    const payload = jwt.verify(token, publicKey) as TokenPayload;
    if (typeof payload === 'string' || !payload.username) {
        throw new Error('Invalid token payload');
    }
    return payload;
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
    const payload = jwt.verify(token, publicKey) as TokenPayload;
    if (typeof payload === 'string' || !payload.username) {
        throw new Error('Invalid token payload');
    }
    return payload;
}

export async function generateAuthorizationCode() {
    return uuidv4();
}

export async function verifyAuthorizationCode(code: string) {
    // In a real implementation, you'd verify the code against stored codes
    // For now, we'll just return true
    return true;
}

// File: src/server/utils/clientStore.ts
// In a real application, you'd use a database for this
const clients: { [key: string]: any } = {};

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
