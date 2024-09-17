// In a real application, you'd use a database for this
const authorizationCodes: { [key: string]: any } = {};

export async function saveAuthorizationCode(code: string, data: any) {
    authorizationCodes[code] = data;
}

export async function getAuthorizationCode(code: string) {
    return authorizationCodes[code];
}

export async function removeAuthorizationCode(code: string) {
    delete authorizationCodes[code];
}