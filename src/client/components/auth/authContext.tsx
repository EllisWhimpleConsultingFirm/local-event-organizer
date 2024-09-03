import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthState {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    updateAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: true,
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
                setAuthState({
                    isAuthenticated: true,
                    isAdmin: data.isAdmin,
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

    const contextValue: AuthContextType = {
        ...authState,
        updateAuthState
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};