'use client';

import React from 'react';
import Link from 'next/link';
import { LogIn, LogOut } from 'lucide-react';

interface AuthSectionProps {
    isAuthorized: boolean;
    isExpanded: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ isAuthorized, isExpanded }) => {
    return isAuthorized ? (
        <Link href="/logout" className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <LogOut size={24} />
            {isExpanded && <span className="ml-3">Logout</span>}
        </Link>
    ) : (
        <Link href="/login" className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <LogIn size={24} />
            {isExpanded && <span className="ml-3">Login</span>}
        </Link>
    );
};