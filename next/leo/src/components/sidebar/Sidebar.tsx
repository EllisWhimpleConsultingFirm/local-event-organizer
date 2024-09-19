import React from 'react';
import Link from 'next/link';
import { Home, Calendar, Users, Settings } from 'lucide-react';
import { SidebarToggle } from './SidebarToggle';
import { AuthSection } from './AuthSection';

interface SidebarProps {
    isExpanded: boolean;
    isAuthorized: boolean;
}

const NavItem: React.FC<{ href: string; icon: React.ReactNode; label: string; isExpanded: boolean }> = ({ href, icon, label, isExpanded }) => (
    <Link href={href} className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        {icon}
        {isExpanded && <span className="ml-3">{label}</span>}
    </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, isAuthorized }) => {
    return (
        <aside className={`fixed left-0 top-0 bg-gray-800 text-white h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} flex flex-col z-10`}>
            <div className="flex justify-end p-4">
                <SidebarToggle isExpanded={isExpanded} />
            </div>

            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-2 p-2">
                    <li><NavItem href="/" icon={<Home size={24} />} label="Home" isExpanded={isExpanded} /></li>
                    <li><NavItem href="/events" icon={<Calendar size={24} />} label="Events" isExpanded={isExpanded} /></li>
                    <li><NavItem href="/vendors" icon={<Users size={24} />} label="Vendors" isExpanded={isExpanded} /></li>
                    {isAuthorized && (
                        <>
                            <li><NavItem href="/admin/vendors" icon={<Users size={24} />} label="Admin Vendor" isExpanded={isExpanded} /></li>
                            <li><NavItem href="/admin/events" icon={<Calendar size={24} />} label="Admin Event" isExpanded={isExpanded} /></li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="mt-auto p-2 space-y-2">
                <NavItem href="/settings" icon={<Settings size={24} />} label="Settings" isExpanded={isExpanded} />
                <AuthSection isAuthorized={isAuthorized} isExpanded={isExpanded} />
            </div>
        </aside>
    );
};

export default Sidebar;