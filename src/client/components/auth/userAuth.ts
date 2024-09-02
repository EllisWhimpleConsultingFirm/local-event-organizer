import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            const token = Cookies.get('access_token');
            if (token) {
                const isValid = await validateTokenWithServer();
                setIsAuthenticated(isValid);
                const isAdmin = await getUserInfo()
                setIsAdmin(isAdmin)
            }
            setIsLoading(false);
        }
        checkAuth();
    }, []);

    return { isAuthenticated, isLoading, isAdmin };
}

async function validateTokenWithServer() : Promise<boolean> {
    const token = Cookies.get('access_token');
    if (!token) return false;

    try {
        const response = await fetch('/api/auth/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}

async function getUserInfo() : Promise<boolean> {
    const token = Cookies.get('access_token');
    if (!token) return false;

    try {
        //TODO change to user endpoint
        const response = await fetch('/api/auth/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //TODO change to get actual user information
        return response.ok;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}