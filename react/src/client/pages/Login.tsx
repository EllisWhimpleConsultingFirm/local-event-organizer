import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {useAuth} from "../components/auth/useAuth.js";

// You might want to store these in an environment variable or configuration file
const CLIENT_ID = 'your_client_id';
const REDIRECT_URI = 'http://localhost:3000/login'; // Changed this to a dedicated callback route
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

const Login: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateAuthState } = useAuth();

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

        const loginUrl = new URL(`${AUTH_SERVER_URL}/auth/login`);
        loginUrl.searchParams.append('client_id', CLIENT_ID);
        loginUrl.searchParams.append('redirect_uri', REDIRECT_URI);
        loginUrl.searchParams.append('response_type', 'code');
        loginUrl.searchParams.append('code_challenge', codeChallenge);
        loginUrl.searchParams.append('code_challenge_method', 'S256');

        // Redirect to login page on authorization server
        window.location.href = loginUrl.toString();
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

            // Update the user info after login
            //TODO may change this so that it doesn't have to re-call the validate endpoint
            await updateAuthState();

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

export default Login;