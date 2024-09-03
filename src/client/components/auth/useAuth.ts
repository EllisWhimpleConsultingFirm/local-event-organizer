import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: true
    });

    const checkAuth = useCallback(async () => {
        const token = Cookies.get('access_token');
        if (!token) {
            setAuthState({ isAuthenticated: false, isAdmin: false, isLoading: false });
            return;
        }

        try {
            const response = await fetch('/api/auth/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setAuthState({
                    isAuthenticated: true,
                    //TODO update this so that it actually get a value
                    isAdmin: true,
                    isLoading: false
                });
            } else {
                setAuthState({ isAuthenticated: false, isAdmin: false, isLoading: false });
            }
        } catch (error) {
            console.error('Error validating token:', error);
            setAuthState({ isAuthenticated: false, isAdmin: false, isLoading: false });
        }
    }, []);

    const updateAuthState = useCallback(async () => {
        await checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return { ...authState, updateAuthState };
}