'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Cookies from 'js-cookie';

interface SidebarToggleProps {
    isExpanded: boolean;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ isExpanded }) => {
    const toggleSidebar = () => {
        const newExpandedState = !isExpanded;
        Cookies.set('sidebarExpanded', newExpandedState.toString(), { expires: 365 }); // Set cookie to expire in 1 year

        // Force a re-render of the page to reflect the new state
        // window.location.reload();
    };

    return (
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
            {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
    );
};