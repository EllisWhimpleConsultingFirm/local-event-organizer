// In a real application, you'd use a database for this
const refreshTokens: { [key: string]: string } = {};

export async function saveRefreshToken(username: string, token: string) {
    refreshTokens[username] = token;
}

export async function getRefreshToken(username: string) {
    return refreshTokens[username];
}

export async function removeRefreshToken(username: string) {
    delete refreshTokens[username];
}

export async function revokeToken(token: string, tokenTypeHint?: string) {
    // In a real implementation, you'd invalidate the token in your storage
    // For now, we'll just remove it from our in-memory store if it's a refresh token
    Object.keys(refreshTokens).forEach(key => {
        if (refreshTokens[key] === token) {
            delete refreshTokens[key];
        }
    });
}