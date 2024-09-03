import jwt from 'jsonwebtoken';
import { generateKeyPair } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let privateKey: string;
let publicKey: string;

const CRED_FOLDER = path.join(__dirname, '..', '..', 'cred');
const PRIVATE_KEY_PATH = path.join(CRED_FOLDER, 'private.pem');
const PUBLIC_KEY_PATH = path.join(CRED_FOLDER, 'public.pem');

async function ensureCredFolder() {
    try {
        await fs.access(CRED_FOLDER);
    } catch (error) {
        await fs.mkdir(CRED_FOLDER, { recursive: true });
    }
}

async function loadOrGenerateKeys() {
    await ensureCredFolder();

    try {
        // Try to load existing keys
        privateKey = await fs.readFile(PRIVATE_KEY_PATH, 'utf8');
        publicKey = await fs.readFile(PUBLIC_KEY_PATH, 'utf8');
        console.log('Loaded existing keys from cred folder');
    } catch (error) {
        // If keys don't exist, generate new ones
        console.log('Generating new keys...');
        await new Promise<void>((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
            }, async (err, publicK, privateK) => {
                if (err) reject(err);
                publicKey = publicK;
                privateKey = privateK;

                // Save the new keys
                await fs.writeFile(PRIVATE_KEY_PATH, privateKey);
                await fs.writeFile(PUBLIC_KEY_PATH, publicKey);
                console.log('New keys generated and saved to cred folder');
                resolve();
            });
        });
    }
}

// Initialize keys
loadOrGenerateKeys().catch(console.error);

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
