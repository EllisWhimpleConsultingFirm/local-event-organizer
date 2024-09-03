import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

const Navigation: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {isAuthenticated && (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </>
                )}
                {!isAuthenticated && (
                    <li><Link to="/login">Login</Link></li>
                )}
                {isAdmin && (
                    <li><Link to="/admin">Admin</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;