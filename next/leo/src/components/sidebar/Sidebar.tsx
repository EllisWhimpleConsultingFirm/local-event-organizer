'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Calendar, Users, Settings, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import './sidebar.css'

interface SidebarProps {
    isAuthorized: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAuthorized }) => {
    const { isExpanded, toggleSidebar } = useSidebar();
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        if (!isExpanded) {
            setIsHovered(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        document.body.dataset.sidebarState = isExpanded ? 'expanded' : (isHovered ? 'hovered' : 'collapsed');
    }, [isExpanded, isHovered]);

    const sidebarState = isExpanded ? 'expanded' : (isHovered ? 'hovered' : 'collapsed');

    if (!isMounted) {
        return null; // Prevent rendering until mounted
    }

    return (
        <aside
            className={`sidebar ${sidebarState} bg-superlightgr text-black h-screen flex flex-col`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex justify-end p-5">
                <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
                    {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>
            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-3 pl-3">
                    <SidebarItem href="/" icon={<Home size={24} />} label="Home" />
                    <SidebarItem href="/events" icon={<Calendar size={24} />} label="EventsDAO" />
                    <SidebarItem href="/vendors" icon={<Users size={24} />} label="Vendors" />
                    {isAuthorized && (
                        <>
                            <SidebarItem href="/admin/vendors" icon={<Users size={24} />} label="Admin Vendor" />
                            <SidebarItem href="/admin/events" icon={<Calendar size={24} />} label="Admin Event" />
                        </>
                    )}
                </ul>
            </nav>
            <div className="mt-auto pl-3 pb-3 space-y-3">
                <SidebarItem href="/settings" icon={<Settings size={24} />} label="Settings" />
                {isAuthorized ? (
                    <SidebarItem href="/logout" icon={<LogOut size={24} />} label="Logout" />
                ) : (
                    <SidebarItem href="/login" icon={<LogIn size={24} />} label="Login" />
                )}
            </div>
        </aside>
    );
};

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label }) => (
    <li>
        <Link href={href} className="sidebar-item flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
            {icon}
            <span className="sidebar-label ml-3">{label}</span>
        </Link>
    </li>
);

export default Sidebar;
