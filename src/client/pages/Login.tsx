import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// You might want to store these in an environment variable or configuration file
const CLIENT_ID = 'your_client_id';
const REDIRECT_URI = 'http://localhost:3000/login'; // Should match your app's URL
const AUTH_SERVER_URL = 'http://localhost:3000/api';

function generateRandomString(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible[x % possible.length])
        .join('');
}

async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const LoginPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        }
    }, [location]);

    const initiateLogin = async () => {
        const codeVerifier = generateRandomString(128);
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Store code verifier in local storage (you might want to use a more secure method in production)
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL(`${AUTH_SERVER_URL}/auth/authorize`);
        authUrl.searchParams.append('client_id', CLIENT_ID);
        authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('code_challenge', codeChallenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');

        // Redirect to authorization server
        window.location.href = authUrl.toString();
    };

    const exchangeCodeForToken = async (code: string) => {
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
            console.error('No code verifier found');
            return;
        }

        try {
            const response = await fetch(`${AUTH_SERVER_URL}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    code_verifier: codeVerifier,
                    code: code,
                    redirect_uri: REDIRECT_URI,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to exchange code for token');
            }

            const data = await response.json();

            // Store tokens (in a real app, store these securely!)
            Cookies.set('access_token', data.access_token, { secure: true, sameSite: 'strict' });
            Cookies.set('refresh_token', data.refresh_token, { secure: true, sameSite: 'strict' });

            // Clear code verifier from storage
            localStorage.removeItem('code_verifier');

            // Redirect to home page or dashboard
            navigate('/');
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            // Handle error (show error message to user, etc.)
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={initiateLogin}>Login with OAuth</button>
        </div>
    );
};

export default LoginPage;